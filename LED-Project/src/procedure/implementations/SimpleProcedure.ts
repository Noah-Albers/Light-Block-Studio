import { ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { IProcedure, ProcedureOptions, ProcedureWithOptions } from "@procedure/definitions/Procedure";

// TODO: Comment
export class SimpleProcedure<Options extends ProcedureOptions> implements IProcedure<Options> {

    public readonly name: string;
    private readonly codeConstructor: ICodeConstructor<Options, any>
    private readonly exampleConfig : Options;
    private readonly diagnostics: IDiagnostics<Options>;
    private readonly ledNode: ILEDNode<Options>;

    constructor(name: string, codeConstructor: ICodeConstructor<Options,any>, diagnostics: IDiagnostics<Options>, ledNode: ILEDNode<Options>, exampleConfig: Options){
        this.name = name;
        this.codeConstructor = codeConstructor;
        this.diagnostics = diagnostics;
        this.exampleConfig = Object.freeze(exampleConfig);
        this.ledNode = ledNode;
    }

    getLEDNode(): ILEDNode<Options> {
        return this.ledNode;
    }

    getDiagnostics(): IDiagnostics<Options> {
        return this.diagnostics;
    }

    getExampleConfig(): Options {
        return this.exampleConfig;
    }

    findSubprocedures(opts: Options): ProcedureWithOptions<any>[] {
        return [];
    }

    getCodeConstructor(): ICodeConstructor<Options, any> {
        return this.codeConstructor;
    }

}