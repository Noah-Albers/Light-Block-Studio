import mitt from "mitt";
import { Signals } from "./Signals";

export type Events = {
    [Signals.VAR_CHANGE]: string
}

export const SignalDispatcher = mitt<Events>();
