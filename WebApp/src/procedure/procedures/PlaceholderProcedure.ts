import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { IProcedure, ProcedureWithOptions } from "@procedure/definitions/Procedure";

export type PlaceholderProcedureOptions = {
    sub: ProcedureWithOptions<any>[];
    encloseInBrackets?: boolean
}

export class PlaceholderProcedure implements IProcedure<PlaceholderProcedureOptions> {
    
    private codeConstr = new PlaceholderProcCodeConstructor();
    private diagnostics = new PlaceholderProcDiagnostics();
    private ledNode = new PlaceholderProcLEDNode();

    public readonly name = "Placeholder";

    getLEDNode(): ILEDNode<PlaceholderProcedureOptions> {
        return this.ledNode;
    }

    findSubprocedures(opts: PlaceholderProcedureOptions): ProcedureWithOptions<any>[] {
        return opts.sub;
    }

    getCodeConstructor(): ICodeConstructor<PlaceholderProcedureOptions, any> {
        return this.codeConstr;
    }

    getDiagnostics(): IDiagnostics<PlaceholderProcedureOptions> {
        return this.diagnostics;
    }

    getExampleConfig(): PlaceholderProcedureOptions {
        return {
            encloseInBrackets: false,
            sub: []
        }   
    }
}

class PlaceholderProcLEDNode implements ILEDNode<PlaceholderProcedureOptions> {
    async startNode(options: PlaceholderProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        // Runs the sub-procedures
        for(let proc of options.sub)
            await proc.procedure.getLEDNode().startNode(proc.options, ctrl);
    }
}

class PlaceholderProcDiagnostics implements IDiagnostics<PlaceholderProcedureOptions> {

    evaluateRuntime(opts: PlaceholderProcedureOptions): number | undefined {
        // Evaluates the runtime of all submodules
        let result = opts.sub.map(proc=>proc.procedure.getDiagnostics().evaluateRuntime(proc.options));

        // Checks if runtime is undefined
        if(result.some(runtime=>runtime === undefined)) return undefined;

        return (result as number[]).reduce((a,b)=>a+b, 0);
    }

    findAllAccessedLeds(opts: PlaceholderProcedureOptions): Set<number> {
        // Gets the accessed leds of all submodules
        let allLeds = opts.sub.map(proc=>proc.procedure.getDiagnostics().findAllAccessedLeds(proc.options));
        
        // Combines them all into one single set
        return new Set(allLeds.flatMap(set => Array.from(set)));
    }
}

class PlaceholderProcCodeConstructor implements ICodeConstructor<PlaceholderProcedureOptions> {

    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: PlaceholderProcedureOptions[]) {
        return [];
    }

    constructCode(options: PlaceholderProcedureOptions, genTools: IExtendedCodeSupport, associatedFunctions: CC_CppFnHandles<{}>, dirtyState: boolean): CodeResult {
        // Generates the code for the submodules
        const result = genTools.generateCodeForProcedures(options.sub, dirtyState);

        const withExtraBrackets = options.encloseInBrackets === true && result.code.trim().length > 0;
        
        if(withExtraBrackets)
            return {
                dirtyState: result.dirtyState,
                code: [
                    "{",
                    ...genTools.setTabs(result.code, 4).split("\n"),
                    "}",
                ].join("\n")
            }
        
        return result;
    }
}
