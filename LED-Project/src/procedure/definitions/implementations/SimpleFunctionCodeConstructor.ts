import { IExtendedCodeSupport, CodeResult, ICodeSupport } from "@cppgen/generator";
import { CC_CppFnHandles, ICodeConstructor } from "../ProcCodeConstructor";
import { PrimitivProcedureOptions, ProcedureOptions } from "../Procedure";
import { CppFnInformation, CppType, ICppFnManager, IVariableSupplier } from "@cppgen/functionManager";

export abstract class SimpleFunctionCodeConstructor<Options extends PrimitivProcedureOptions> implements ICodeConstructor<Options, { base: Options }> {
    

    abstract getTypeMapping(): { [x in keyof Options]: CppType; };
    abstract generateFunctionCode(vs: IVariableSupplier, args: CppFnInformation<Options>, supplyed: ICodeSupport): string;
    abstract getDirtyStateAfterExecution(options: Options, previousState: boolean) : boolean;
    abstract getFunctionName() : string;

    constructCode(options: Options, genTools: IExtendedCodeSupport, {base}: CC_CppFnHandles<{ base: Options; }>, dirtyState: boolean): CodeResult {
        return {
            code: genTools.callFunction(base, options),
            dirtyState: this.getDirtyStateAfterExecution(options, dirtyState)
        }
    }

    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: Options[]): CC_CppFnHandles<{ base: Options; }> {
        return {
                base: cppFnManager.addFunction({
                name: this.getFunctionName(),
                types: this.getTypeMapping(),
                generator: this.generateFunctionCode
            })
        };
    }

}