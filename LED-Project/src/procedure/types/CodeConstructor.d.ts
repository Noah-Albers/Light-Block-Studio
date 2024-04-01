import { CppArgs, CppType, ICppFnCallGenerator, ICppGenerator, IPreCppFn, IVariableSupplier } from "@cppgen/Types";
import { ProcedureOptions } from "./Procedure";
import { CppGenerator } from "@cppgen/index";

// TODO: Maybe use later
//export type Options2CppTypeMapping<Options extends ProcedureOptions> = {[key in keyof Options]: CppType}

export type CodeConstructionResult = {
    /**
     * The actual c++ source code that was generated for the procedure.
     */
    code: string,

    /**
     * If the led-stripe should now be considered "dirty" (Meaning that some updates have not been pushed yet).
     */
    isDirty: boolean
}

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
 * This mapping is utilized by the CodeConstructor class to providing type information for IntelliSense.
 * @private
 */
export type CC_CppFnMapping<Defs extends CC_CppFnDefs> = {
    [functionName in keyof Defs]: IPreCppFn<Defs[functionName]>;
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
 *      // This could now say "myFunc(2);" or maybe just "myFunc()" (Depending on the decissions of the CppGenerator)
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
     * Registers all functions to the CppGenerator
     * @param cppGenerator
     * 
     * @returns a mapping list with all functions that are used.
     * This mapping-object is later be used by the "constructCode" method to generate the calls to that function.
     */
    registerFunctions(cppGenerator: ICppGenerator) : CC_CppFnMapping<AssociatedCppFnDefs>

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
     * @param isDirty a flag that defines if the led-stripe is still "dirty" (Meaning some updates may not have been pushed yet) from the previous procedures
     */
    constructCode(
        options: Options,
        vs: IVariableSupplier,
        callGenerator: ICppFnCallGenerator,
        associatedFunctions: CC_CppFnMapping<AssociatedCppFnDefs>,
        isDirty: boolean
    ) : CodeConstructionResult;



    // TODO: Maybe use later
    /*
    / **
     * @returns the mappings which can be used to translate the procedure options into actual cpp options
     * /
    findOptions2CppMapping() : Options2CppTypeMapping<Options>;
    */

}