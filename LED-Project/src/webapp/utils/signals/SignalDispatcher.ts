import mitt from "mitt";
import { Signals } from "./Signals";
import { Block } from "blockly";
import { EventArgsBlocklyClrReqAttach } from "./SignalArgumentTypes";

export type Events = {
    [Signals.VAR_CHANGE]: void,
    [Signals.BLOCKLY_BLOCK_SELECTION_CHANGE]: Block,
    [Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH]: EventArgsBlocklyClrReqAttach,
    [Signals.BLOCKLY_COLOR_FIELD_REQ_DETACH]: void
}

export const SignalDispatcher = mitt<Events>();
