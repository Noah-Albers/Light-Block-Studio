import { IExtendedCodeSupport, CodeResult, ICodeSupport } from "@cppgen/generator";
import { CC_CppFnHandles, ICodeConstructor } from "../ProcCodeConstructor";
import { PrimitivProcedureOptions, ProcedureOptions } from "../Procedure";
import { CppFnInformation, CppType, ICppFnManager, IVariableSupplier } from "@cppgen/functionManager";

type Functions<Options> = {
    base: Options
}

export abstract class SimpleFunctionCodeConstructor<Options extends PrimitivProcedureOptions> implements ICodeConstructor<Options, Functions<Options>> {
    
    // TODO: Comment

    abstract getTypeMapping(): { [x in keyof Options]: CppType; };
    abstract generateFunctionCode(args: CppFnInformation<Options>, supplyed: ICodeSupport): string;
    abstract getDirtyStateAfterExecution(options: Options, previousState: boolean) : boolean;
    abstract getFunctionName() : string;

    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: Options[]): CC_CppFnHandles<Functions<Options>> {
        return {
            base: cppFnManager.addFunction({
                name: this.getFunctionName(),
                types: this.getTypeMapping(),
                generator: this.generateFunctionCode
            }).addCall(calls)
        };
    }

    constructCode(options: Options, genTools: IExtendedCodeSupport, {base}: CC_CppFnHandles<Functions<Options>>, dirtyState: boolean): CodeResult {
        return {
            code: genTools.callFunction(base, options),
            dirtyState: this.getDirtyStateAfterExecution(options, dirtyState)
        }
    }

}