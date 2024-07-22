import { BlockSvg } from "blockly";
import { ExportedNodeStackType, ExportedNodeType, ExportedProjectType, ExportedSettingsType, ExportedVariablesType, ExportedWorkspaceType } from "./ProjectSchema";
import { BLOCKLY_SUBBLOCKY_NAME } from "@webapp/blockly/RegisterBlockly";
import { getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { getRootBlocks } from "@webapp/utils/blockly/BlockUtils";

// Serializes the workspace
async function getWorkspaceExport(): Promise<ExportedWorkspaceType> {

    /**
     * Takes in a single blockly-block (With a model and such) and creates a serializable object from it
     * 
     * @returns this serializable object or undefined if a block is given which has no model
     */
    function getBlockExport(block: BlockSvg): ExportedNodeType | undefined {
        // Gets the model
        const model = getBlockModel(block);

        if (model === undefined)
            return undefined;

        const dataObj = getBlockDataObject(block)!;

        const sources = [...new Set([...model.getSources(), ...model.getOnBlockSources()])];

        // Holds the data source exports
        const exportedData: { [key: string]: string | boolean | number | object } = {};

        // Creates the exports
        sources.forEach(src => {
            exportedData[src.getKey()] = src.export(dataObj[src.getKey()]);
        });

        let subnodeExports: ExportedNodeType[] | undefined = undefined;

        // Generates the subexports
        if (model.hasSubNodes())
            subnodeExports = generateBlockExports(block.getInputTargetBlock(BLOCKLY_SUBBLOCKY_NAME)! as BlockSvg);

        return {
            data: exportedData,
            type: model.getModelName(),
            subnodes: subnodeExports
        }
    }

    /**
     * Takes in a "root" (Top) block and generates a stack export which means that it generates an export containing the x,y coordinate of the stack and
     * all blocks on and connected to that block.
     */
    function getBlockStackExport(root: BlockSvg): ExportedNodeStackType {
        return {
            nodes: generateBlockExports(root),
            x: root.relativeCoords.x,
            y: root.relativeCoords.y
        }
    }

    /**
     * Takes in a single blockly block and generates the exports of it and each block that is connected to it
     */
    function generateBlockExports(block: BlockSvg): ExportedNodeType[] {
        const list: ExportedNodeType[] = [];

        while (block !== null) {
            let exp = getBlockExport(block);

            // Moves to the next block
            (block as BlockSvg | null) = block.getNextBlock();

            if (exp === undefined)
                continue;

            list.push(exp);
        }

        return list;
    }

    // 1. Gets the blockly-blocks
    const rootBlocks = await getRootBlocks();

    // Gets the loop, setup and other block exports
    const loopExports = getBlockStackExport(rootBlocks.loop);
    const setupExports = getBlockStackExport(rootBlocks.setup);
    
    // Gets the others with extra coordinates
    const otherExports = rootBlocks.other.map(getBlockStackExport);

    return {
        loop: loopExports,
        setup: setupExports,
        other: otherExports
    }
}

// Serializes the variables
function getVariablesExport() : ExportedVariablesType {
    return useVariableStore().variables.map(v=>({
        name: v.name,
        value: v.value
    }))
}

// Serializes the project settings
function getSettingsExport() : ExportedSettingsType {
    return useProjectStore().exportData();
}

// Exports the whole loaded project as a json-serializable object.
// Can be loaded again using the project importer
export async function exportProject(): Promise<ExportedProjectType> {
    return {
        settings: getSettingsExport(),
        variables: getVariablesExport(),
        workspace: await getWorkspaceExport()
    }
}