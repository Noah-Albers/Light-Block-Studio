import { CC_CppFnHandles, ICodeConstructor } from "src/procedure/definitions/ProcCodeConstructor";
import { LoopProcedureOptions } from "./LoopProcedure";
import { IExtendedCodeSupport, CodeResult } from "@cppgen/generator";
import { CppArgs, CppFnGenerator, CppFnInformation, CppType, ICppFnManager, IVariableSupplier } from "@cppgen/functionManager";

export class LoopProcCodeConstructor implements ICodeConstructor<LoopProcedureOptions> {

    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: LoopProcedureOptions[]) {
        return [];
    }

    constructCode(options: LoopProcedureOptions, genTools: IExtendedCodeSupport, associatedFunctions: CC_CppFnHandles<{}>, dirtyState: boolean): CodeResult {
        // Generates the code for the submodules

        const result = genTools.generateCodeForProcedures(options.sub, dirtyState);

        let idx = genTools.registerVariable("idx");

        // Generates the code
        let code = `
            for(int ${idx}=0;${idx}<${options.repeats}; ${idx}++){
                ${genTools.setTabs(result.code, 4)}
            }
        `;

        return {
            code,
            dirtyState: result.dirtyState
        }
    }
}

