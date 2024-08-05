import { IExtendedCodeSupport, CodeResult, ICodeSupport } from "@cppgen/generator";
import { CppFnInformation, CppType, ICppFnManager, IVariableSupplier } from "@cppgen/functionManager";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { PrimitivProcedureOptions } from "@procedure/definitions/Procedure";

type Functions<Options> = {
    base: Options
}

export abstract class SimpleFunctionCodeConstructor<Options extends PrimitivProcedureOptions> implements ICodeConstructor<Options, Functions<Options>> {
    
    /**
     * Resolves mapping between typescript passed options and their cpp types
     */
    abstract getTypeMapping(): { [x in keyof Options]: CppType; };

    /**
     * Ts-Function that generates the cpp-functions code.
     * @param args arguments to use when generating the cpp function
     * @param supplyed the code support to use
     */
    abstract generateFunctionCode(args: CppFnInformation<Options>, supplyed: ICodeSupport): string;

    /**
     * If the internal led stripe has values that have not been pushed to the main stripe after the code has executed
     */
    abstract getDirtyStateAfterExecution(options: Options, previousState: boolean) : boolean;

    /**
     * Name of the function to use inside the cpp-code. Note!: This is only a suggestion. Do to duplication reasons, the manager can decide to use a different altho simelar name
     */
    abstract getFunctionName() : string;

    /**
     * Overwritten to register the single function to the manager
     */
    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: Options[]): CC_CppFnHandles<Functions<Options>> {
        return {
            base: cppFnManager.addFunction({
                name: this.getFunctionName(),
                types: this.getTypeMapping(),
                generator: this.generateFunctionCode
            }).addCall(calls)
        };
    }

    /**
     * Overwritten to construct only a function call
     */
    constructCode(options: Options, genTools: IExtendedCodeSupport, {base}: CC_CppFnHandles<Functions<Options>>, dirtyState: boolean): CodeResult {
        return {
            code: genTools.callFunction(base, options),
            dirtyState: this.getDirtyStateAfterExecution(options, dirtyState)
        }
    }

}