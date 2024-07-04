import { getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { BLOCKLY_SUBBLOCKY_NAME } from "@webapp/blockly/RegisterBlockly";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Block, WorkspaceSvg } from "blockly";

// TODO: Comment all

type BlockExport = {
    type: string,
    data: {[key: string]: string | boolean | number | object},
    subblocks?: BlockExport[]
}

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

function getBlockExport(block: Block) : BlockExport | undefined {
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
        subnodeExports = generateBlockExports(block.getInputTargetBlock(BLOCKLY_SUBBLOCKY_NAME)!);

    return {
        data: exportedData,
        type: model.getModelName(),
        subblocks: subnodeExports
    }
}

function generateBlockExports(block: Block) : BlockExport[] {
    const list: BlockExport[] = [];

    while(block !== null){
        let exp = getBlockExport(block);

        // Moves to the next block
        (block as Block | null) = block.getNextBlock();
        
        if(exp === undefined)
            continue;

        list.push(exp);
    }

    return list;
}

export async function exportProject() : Promise<string> {

    // 1. Gets the blockly-blocks
    const rootBlocks = await getRootBlocks();

    // Gets the loop and setup exports
    const loopExports = generateBlockExports(rootBlocks.loop);
    const setupExports = generateBlockExports(rootBlocks.setup);
    
    // Gets the others with extra coordinates
    const otherExports = rootBlocks.other.map(topBlock => ({
        exports: generateBlockExports(topBlock),
        x: topBlock.relativeCoords.x,
        y: topBlock.relativeCoords.y  
    }));

    // 2. Get project settings
    const projectSettingsExports = useProjectStore().export;

    // 3. Get variables
    const variableExports = useVariableStore().export;

    return JSON.stringify({
        workspace: {
            loop: loopExports,
            setup: setupExports,
            other: otherExports
        },
        settings: projectSettingsExports,
        variables: variableExports
    });
}