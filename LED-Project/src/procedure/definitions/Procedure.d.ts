import { ICodeConstructor } from "./ProcCodeConstructor";

/**
 * Defines a combined type that takes a reference to a procedure and options for it.
 */
export type ProcedureWithOptions<Options extends ProcedureOptions> = {
    procedure: IProcedure<Options>,
    options: Options
}


/**
 * This is the tpye of which all options for procedures must inherit from.
 * 
 * It ensures that only simple generic types or more sub parameters are passed.
 */
export type ProcedureOptions = {[key: string]: string | boolean | number | ProcedureOptions | ProcedureOptions[]}

/**
 * This is the abstract base class which every procedure uses.
 */
export interface IProcedure<Options extends ProcedureOptions>{
    /**
     * A unique identifier for the procedure and used as it's identifier.
     */
    name: string

    /**
     * @returns all procedures that are executed during the execution of this one.
     * 
     * This can be used for loops or if statements
     */
    findSubprocedures(opts: Options) : ProcedureOptions<any>[];

    /**
     * @returns a codeconstructor for the current procedure
     */
    getCodeConstructor() : ICodeConstructor<unknown,unknown>;
}