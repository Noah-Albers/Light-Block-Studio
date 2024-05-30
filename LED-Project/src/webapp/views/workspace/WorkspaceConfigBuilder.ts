import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { Registry } from "@registry/Registry";
import { buildProceduresOfBlock } from "@webapp/blockly/BlocklyProcedureBuilder";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Block, Workspace, getSelected } from "blockly";
import equals from "deep-equal"

// Elements to compare the new generated configs to, to determin if the change signals shall be send
let cmpElements: {
    preview: ProcedureWithOptions<any>[] | undefined,
    setup: ProcedureWithOptions<any>[] | undefined,
    loop: ProcedureWithOptions<any>[] | undefined
} = {} as any;


/**
 * Event whenever the blockly workspace changes.
 * Note: This may be called multiple times, so a debounce function is required
 * @param {Workspace} ws the blockly workspace which changed
 */
export function buildWorkspaceAndSendEvents(ws: Workspace, forceRebuild: boolean = false){
    
    // Gets all blocks that are not disabled (So basially only the top root blocks)
	var blocks = ws.getTopBlocks().filter((block: Block)=>block.isEnabled());

	// Gets the blocks
    var setup = blocks.find(blg=>blg.type==="led_root_setup")!;
    var loop = blocks.find(blg=>blg.type==="led_root_loop")!;

    let selectedBlock = getSelected() as any as Block | undefined;
    if(selectedBlock === null) selectedBlock = undefined;

    // Builds the configs
    const setupCfg = buildProceduresOfBlock(setup.getNextBlock(), selectedBlock);
    const loopCfg = buildProceduresOfBlock(loop.getNextBlock(), setupCfg.foundProc === undefined ? selectedBlock : undefined);

    // Gets the preview config which changes based on the users selection
    let previewConfig: ProcedureWithOptions<any>[] | undefined = (function getPreview() {
        if(setupCfg.foundProc)
            return [setupCfg.foundProc]

        if(loopCfg.foundProc)
            return [loopCfg.foundProc];

        if(selectedBlock === loop || selectedBlock === setup) return undefined;

        if(selectedBlock !== undefined)
            return buildProceduresOfBlock(selectedBlock).all;

        // If nothing is selected, run all setup procedures and add the loop procedures as infinit too
        return [
            ...setupCfg.all,
            {
                procedure: Registry.procedures.loop,
                options: {
                    // Ensures infinit repeats
                    repeats: -1,
                    sub: loopCfg.all
                }
            }
        ]
    })();

    // Checks if the configs are different from the previous ones and if so, sends the events

    if(cmpElements.preview === undefined || !equals(previewConfig,cmpElements.preview) || forceRebuild){
        cmpElements.preview = previewConfig
        SignalDispatcher.emit(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, previewConfig);
    }

    if(
        forceRebuild ||
        cmpElements.loop === undefined ||
        cmpElements.setup === undefined ||
        !equals(setupCfg.all, cmpElements.setup) ||
        !equals(loopCfg.all, cmpElements.loop)){
            cmpElements.setup = setupCfg.all;
            cmpElements.loop = loopCfg.all;
            SignalDispatcher.emit(Signals.BLOCKLY_ALL_CREATE_CONFIG, {
                setup: setupCfg.all,
                loop: loopCfg.all
            });
        }
}