import mitt from "mitt";
import { Signals } from "./Signals";
import { Block } from "blockly";
import { EventArgsBlocklyClrReqAttach } from "./SignalArgumentTypes";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";

export type Events = {
    [Signals.VAR_CHANGE]: void,
    [Signals.BLOCKLY_BLOCK_SELECTION_CHANGE]: Block,
    [Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH]: EventArgsBlocklyClrReqAttach,
    [Signals.BLOCKLY_COLOR_FIELD_REQ_DETACH]: void,
    [Signals.BLOCKLY_PREVIEW_CREATE_CONFIG]: ProcedureWithOptions<any>[] | undefined,
    [Signals.BLOCKLY_ALL_CREATE_CONFIG]: {
        setup: ProcedureWithOptions<any>[],
        loop: ProcedureWithOptions<any>[]
    },
}

export const SignalDispatcher = mitt<Events>();
