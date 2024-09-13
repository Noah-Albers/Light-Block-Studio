import mitt from "mitt";
import { Signals } from "./Signals";
import { Block, WorkspaceSvg } from "blockly";
import { EventArgsBlocklyClrReqAttach, EventArgsPopup, EventArgsSnackbar, EventVue2HTMLRequest } from "./SignalArgumentTypes";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";

export type Events = {
    [Signals.VAR_CHANGE]: void,
    [Signals.BLOCKLY_BLOCK_SELECTION_CHANGE]: Block,
    [Signals.BLOCKLY_PREVIEW_CREATE_CONFIG]: ProcedureWithOptions<any>[] | undefined,
    [Signals.BLOCKLY_ALL_CREATE_CONFIG]: {
        setup: ProcedureWithOptions<any>[],
        loop: ProcedureWithOptions<any>[]
    },
    [Signals.REQUEST_CONFIG_BUILD]: void,
    [Signals.DISPLAY_SNACKBAR]: EventArgsSnackbar,
    [Signals.DISPLAY_POPUP]: EventArgsPopup,
    [Signals.BLOCKLY_REQUEST_WORKSPACE]: (ws: WorkspaceSvg)=>void,
    [Signals.BLOCKLY_REQUEST_VUE_HTML_INJECT]: EventVue2HTMLRequest<any>,
    [Signals.BLOCKLY_REQUEST_VUE_HTML_DETACH]: Element,
    [Signals.BLOCKLY_CLICK_IN_WORKSAPCE]: void,
    [Signals.BLOCKLY_SET_DISABLE_BLOCKLY_EVENTS_FLAG]: boolean
}

export const SignalDispatcher = mitt<Events>();
