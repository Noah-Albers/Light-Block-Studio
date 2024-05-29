import { ICodeConstructor } from "src/procedure/definitions/ProcCodeConstructor";
import { IProcedure, ProcedureWithOptions } from "src/procedure/definitions/Procedure";
import { LoopProcCodeConstructor } from "./LoopProcCodeConstructor";
import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { LoopProcDiagnostics } from "./LoopProcDiagnostics";
import { LoopProcLEDNode } from "./LoopProcLEDNode";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";

export type LoopProcedureOptions = {
    /**
     * How many repeats shall be made, if negative, the repeat cound will be infinite
     */
    repeats: number,
    sub: ProcedureWithOptions<any>[]
}

export class LoopProcedure implements IProcedure<LoopProcedureOptions> {
    
    private codeConstr = new LoopProcCodeConstructor();
    private diagnostics = new LoopProcDiagnostics();
    private ledNode = new LoopProcLEDNode();

    public readonly name = "Loop";

    getLEDNode(): ILEDNode<LoopProcedureOptions> {
        return this.ledNode;
    }

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