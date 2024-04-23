import mitt from "mitt";
import { Signals } from "./Signals";
import { Block } from "blockly";

export type Events = {
    [Signals.VAR_CHANGE]: string,
    [Signals.BLOCKLY_BLOCK_SELECTION_CHANGE]: Block
}

export const SignalDispatcher = mitt<Events>();
