import { ICodeConstructor } from "src/procedure/definitions/ProcCodeConstructor";
import { IProcedure, ProcedureWithOptions } from "src/procedure/definitions/Procedure";
import { LoopProcCodeConstructor } from "./LoopProcCodeConstructor";
import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { LoopProcDiagnostics } from "./LoopProcDiagnostics";

export type LoopProcedureOptions = {
    repeats: number,
    sub: ProcedureWithOptions<any>[]
}

export class LoopProcedure implements IProcedure<LoopProcedureOptions> {
    
    private codeConstr = new LoopProcCodeConstructor();
    private diagnostics = new LoopProcDiagnostics();

    public readonly name = "Loop";

    findSubprocedures(opts: LoopProcedureOptions): ProcedureWithOptions<any>[] {
        return opts.sub;
    }

    getCodeConstructor(): ICodeConstructor<LoopProcedureOptions, any> {
        return this.codeConstr;
    }

    getDiagnostics(): IDiagnostics<LoopProcedureOptions> {
        return this.diagnostics;
    }

    getExampleConfig(): LoopProcedureOptions {
        return {
            repeats: 1,
            sub: []
        }   
    }
}