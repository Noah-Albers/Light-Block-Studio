import { WorkspaceSvg } from "blockly";
import { SignalDispatcher } from "../signals/SignalDispatcher";
import { Signals } from "../signals/Signals";

// Requests the workspace from the TheWorkspace.vue component
export function getWorkspace() : Promise<WorkspaceSvg> {
    return new Promise(res=>SignalDispatcher.emit(Signals.BLOCKLY_REQUEST_WORKSPACE, res));
}

/**
 * Resets and create the default workspace with the loop and setup blocks
 */
export function resetWorkspace(ws: WorkspaceSvg){

    ws.clear();

    const setup = ws.newBlock("led_root_setup");
    setup.moveBy(100,100);
    setup.initSvg();
    setup.render();

    const loop = ws.newBlock("led_root_loop");
    loop.moveBy(350,100);
    loop.initSvg();
    loop.render();

    // Removes all undos (Prevents undoing adding the root and setup things...)
    ws.clearUndo();

    return { setup, loop  }
}

/**
 * Async version of the getRooBlocksUsingWS method which doesn't require a workspace
 */
export async function getRootBlocks() {
    return getRootBlocksUsingWS(await getWorkspace());
}

/**
 * Takes in a workspace and gets the top blocks from it
 * 
 * Returns the setup and loop blocks seperate and all other root blocks as an array
 * 
 */
export function getRootBlocksUsingWS(ws: WorkspaceSvg) {

    // Gets the root blocks
    const topBlocks = ws.getTopBlocks();

    const setup = topBlocks.find(block => block.type === "led_root_setup");
    const loop = topBlocks.find(block => block.type === "led_root_loop");

    if (setup === undefined)
        throw new Error("Setup-block wasn't found on the workspace...");
    if (loop === undefined)
        throw new Error("Loop-block wasn't found on the workspace...");

    const other = topBlocks.filter(block => block !== setup && block !== loop)

    return {
        setup, loop, other,
        workspace: ws
    }
}