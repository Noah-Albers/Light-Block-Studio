import { getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { BLOCKLY_SUBBLOCKY_NAME } from "@webapp/blockly/RegisterBlockly";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Block, BlockSvg, WorkspaceSvg } from "blockly";
import { BlockExport, BlockStackExport, FullExport } from "./SaveStateType";

// TODO: Comment all


async function getRootBlocks(){
    // Gets the workspace
    const ws: WorkspaceSvg = await (new Promise(res=>SignalDispatcher.emit(Signals.BLOCKLY_REQUEST_WORKSPACE,res)));
    
    // Gets the root blocks
    const topBlocks = ws.getTopBlocks();

    const setup = topBlocks.find(block=>block.type==="led_root_setup");
    const loop = topBlocks.find(block=>block.type==="led_root_loop");

    if(setup === undefined)
        throw new Error("Setup-block wasn't found on the workspace...");
    if(loop === undefined)
        throw new Error("Loop-block wasn't found on the workspace...");

    const other = topBlocks.filter(block => block !== setup && block !== loop)

    return {
        setup, loop, other
    }
}

function getBlockExport(block: BlockSvg) : BlockExport | undefined {
    // Gets the model
    const model = getBlockModel(block);

    if(model === undefined)
        return undefined;

    const dataObj = getBlockDataObject(block)!;

    const sources = [...new Set([...model.getSources(), ...model.getOnBlockSources()])];

    // Holds the data source exports
    const exportedData: {[key: string]: string | boolean | number | object} = {};

    // Creates the exports
    sources.forEach(src=>{
        exportedData[src.getKey()] = src.export(dataObj[src.getKey()]);
    });

    let subnodeExports = undefined;

    // Generates the subexports
    if(model.hasSubNodes())
        subnodeExports = generateBlockExports(block.getInputTargetBlock(BLOCKLY_SUBBLOCKY_NAME)! as BlockSvg);

    return {
        data: exportedData,
        type: model.getModelName(),
        subblocks: subnodeExports
    }
}

function getBlockStackExport(root: BlockSvg) : BlockStackExport {
    return {
        blocks: generateBlockExports(root),
        x: root.relativeCoords.x,
        y: root.relativeCoords.y  
    }
}

function generateBlockExports(block: BlockSvg) : BlockExport[] {
    const list: BlockExport[] = [];

    while(block !== null){
        let exp = getBlockExport(block);

        // Moves to the next block
        (block as BlockSvg | null) = block.getNextBlock();
        
        if(exp === undefined)
            continue;

        list.push(exp);
    }

    return list;
}

export async function exportProject() : Promise<FullExport> {

    // 1. Gets the blockly-blocks
    const rootBlocks = await getRootBlocks();

    // Gets the loop, setup and other block exports
    const loopExports = getBlockStackExport(rootBlocks.loop);
    const setupExports = getBlockStackExport(rootBlocks.setup);
    
    // Gets the others with extra coordinates
    const otherExports = rootBlocks.other.map(getBlockStackExport);

    // 2. Get project settings
    const projectSettingsExports = useProjectStore().export;

    // 3. Get variables
    const variableExports = useVariableStore().export;

    const fullExport: FullExport = {
        settings: projectSettingsExports,
        variables: variableExports,
        workspace: {
            loop: loopExports,
            setup: setupExports,
            other: otherExports
        }
    }

    return fullExport;
}