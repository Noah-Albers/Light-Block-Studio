import { ICodeConstructor } from "src/procedure/definitions/ProcCodeConstructor";
import { IProcedure, ProcedureOptions, ProcedureWithOptions } from "src/procedure/definitions/Procedure";
import { LoopProcCodeConstructor } from "./LoopProcCodeConstructor";

export type LoopProcedureOptions = {
    repeats: number,
    sub: ProcedureWithOptions<any>[]
}

export class LoopProcedure implements IProcedure<LoopProcedureOptions> {
    
    private codeConstr = new LoopProcCodeConstructor();
    
    public readonly name = "Loop";

    findSubprocedures(opts: LoopProcedureOptions): ProcedureWithOptions<any>[] {
        return opts.sub;
    }

    getCodeConstructor(): ICodeConstructor<LoopProcedureOptions, any> {
        return this.codeConstr;
    }

}