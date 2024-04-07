import { ICodeConstructor } from "../ProcCodeConstructor";
import { IProcedure, ProcedureOptions, ProcedureWithOptions } from "../Procedure";

// TODO: Comment
export class SimpleProcedure<Options extends ProcedureOptions> implements IProcedure<Options> {

    public readonly name: string;
    private readonly codeConstructor: ICodeConstructor<Options, any>
    private readonly exampleConfig : Options;

    constructor(name: string, codeConstructor: ICodeConstructor<Options,any>, exampleConfig: Options){
        this.name = name;
        this.codeConstructor = codeConstructor;
        this.exampleConfig = Object.freeze(exampleConfig);
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