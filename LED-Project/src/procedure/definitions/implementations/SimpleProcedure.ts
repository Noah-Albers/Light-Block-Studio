import { ICodeConstructor } from "../ProcCodeConstructor";
import { IDiagnostics } from "../ProcDiagnostics";
import { IProcedure, ProcedureOptions, ProcedureWithOptions } from "../Procedure";

// TODO: Comment
export class SimpleProcedure<Options extends ProcedureOptions> implements IProcedure<Options> {

    public readonly name: string;
    private readonly codeConstructor: ICodeConstructor<Options, any>
    private readonly exampleConfig : Options;
    private readonly diagnostics: IDiagnostics<Options>;

    constructor(name: string, codeConstructor: ICodeConstructor<Options,any>, diagnostics: IDiagnostics<Options>, exampleConfig: Options){
        this.name = name;
        this.codeConstructor = codeConstructor;
        this.diagnostics = diagnostics;
        this.exampleConfig = Object.freeze(exampleConfig);
    }

    getDiagnistics(): IDiagnostics<Options> {
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