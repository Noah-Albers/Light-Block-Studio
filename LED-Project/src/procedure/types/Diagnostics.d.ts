import { ProcedureOptions } from "./Procedure";


export interface Diagnostics<Options extends ProcedureOptions> {

    /**
     * @returns an set which holds all led indexes that are accessed at some part of the procedure.
     */
    findAllAccessedLeds(opts: Options) : Set<number>;

    /**
     * @returns how many milliseconds the procedure executes
     * if the runtime is unknown undefined is returned
     */
    evaluateRuntime() : number | undefined;
}