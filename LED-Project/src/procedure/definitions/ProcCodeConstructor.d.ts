import { CppArgs, CppType, ICppFnCallGenerator, ICppFnManager, ICppFnHandle, IVariableSupplier } from "@cppgen/functionManager/index";
import { ProcedureOptions } from "./Procedure";
import { CppFnManager } from "@cppgen/functionManager/index";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator/definitions/CppGeneratorDefinitions";

/**
 * Defines a mapping of names to their corresponding arguments.
 * 
 * This mapping is used by the CodeConstructor class to provide type information for IntelliSense.
 * @private
 */
export type CC_CppFnDefs = {
    [functionName: string]: CppArgs;
}


/**
 * This handle is utilized by the @see CodeConstructor class to providing type information for IntelliSense.
 * @private
 */
export type CC_CppFnHandles<Defs extends CC_CppFnDefs> = {
    [functionName in keyof Defs]: ICppFnHandle<Defs[functionName]>;
}


/**
 * 
 * Defines the interface for a procedure that is responsible for generating the c++ code for that procedure
 * 
 * @example (Inherit for Function override)
 * 
 * type MyFuncArgs = {
 *  a: number
 * }
 * 
 * class MyCodeConstructor inherits ICodeConstructor<..., { myfunc: MyFuncArgs }> {
 * 
 *  registerFunctions(cppGen) {
 *      let someFunc = cppGen.addFunc<SomeFuncArgs>({...});
 * 
 *      return {
 *          myfunc: someFunc
 *      }
 * 
 *  }
 * 
 *  constructCode(..., callGen, funcs){
 *      let call2MyFunc = callGen.getCallFor(funcs.myfunc, { a: 2 });
 *      // This could now say "myFunc(2);" or maybe just "myFunc()" (Depending on the decissions of the CppFnManager)
 * 
 * 
 *      ...
 *  }
 * 
 * }
 * 
 */
export interface ICodeConstructor
    <
        /** The options of the procedure */
        Options extends ProcedureOptions,
        
        /**
         * A mapping for the class, so that it to know which functions are registered and used by the class.
         * Also it assignes them all a name to use so that the "registerFunctions" and "constructCode"
         * methods can use them with full intellisense.
         * 
         * By default this is empty
         */
        AssociatedCppFnDefs extends CC_CppFnDefs = {}
    >{


    /**
     * Registers all functions to the CppFnManager
     * @param cppFnManager
     * @param calls all calls of the procedure
     * 
     * @returns a mapping list with all functions that are used.
     * This mapping-object is later be used by the "constructCode" method to generate the calls to that function.
     */
    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: Options[]) : CC_CppFnHandles<AssociatedCppFnDefs>

    /**
     * 
     * The method that is used to actually generate the raw cpp source code (For the procedure)
     * 
     * it is given
     * 
     * @param options the options of the procedure 
     * @param vs the variable supplier system to request uniquly named variable. Note that
     * @param callGenerator from the cpp-generator system. It is used to generate function calls to functions registered by "registerFunctions"
     * @param associatedFunctions the functions that were registered by "registerFunctions"
     * @param dirtyState a flag that defines if the led-stripe is still "dirty" (Meaning some updates may not have been pushed yet) from the previous procedures
     */
    constructCode(
        options: Options,
        genTools: IExtendedCodeSupport,
        associatedFunctions: CC_CppFnHandles<AssociatedCppFnDefs>,
        dirtyState: boolean
    ) : CodeResult;

}