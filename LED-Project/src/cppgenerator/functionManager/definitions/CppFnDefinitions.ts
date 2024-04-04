/**
 * Represents a basic template for all arguments that can be passed to a Cpp-Fn.
 * 
 * This type defines a mapping of argument names to their corresponding data types.
 */
export type CppArgs = {
    [argName: string]: number | boolean | string;
}

/**
 * All supported types that can be used. These are used to map between arguments passed as CppArgs and later on the actual code that is generated
 */
export enum CppType {
    INT = "int",         // Represents an integer type
    FLOAT = "float",     // Represents a floating-point type
    BOOLEAN = "bool",    // Represents a boolean type
    DOUBLE = "double",   // Represents a double-precision floating-point type
    CHAR = "char"        // Represents a character type
}

/**
 * This type is passed as an array into the typescript function which generates the actual c++ code for a c++ function.
 * 
 * If available is true, the actual value will be given in "value". Such as boolean, number (So the generating function can generate more performant code).
 * If available is false, a variable name will be the value of "value".
 * 
 * Further the toString method is defined to return the value as a string so that the following syntax would be possible:
 * 
 * @example
 * let "a" be a variable of CppFnArgInformation in this example.
 * 
 * const code = `${a} + 5`;
 * 
 * could result in:
 * 
 * "a + 5" (If the value is not given) or "4 + 5" (If the value is given)
 */
export type CppFnArgInformation<Value> = {
    available: true,
    value: Value,
    toString() : string
} | {
    available: false,
    value: string,
    toString() : string
}

/**
 * This is just a mapping of the typescript var names to corresponding Information
 * @see CppFnArgInformation s example for more information
 */
export type CppFnInformation<Args extends CppArgs> = {[key in keyof Args]: CppFnArgInformation<Args[key]>}

/**
 * This is the definition for a typescript generator function that generates actual C++ Source-code for a function.
 * 
 * If takes
 * @param vs the Variablesupplier to let functions request addition variables without running into name problems
 * @param args the arguments which should be passed to a function (Either as variables or as direct values which can be printed into the c++ code)
 * @see CppFnArgInformation s example for more information about how that works.
 * 
 * @type {Supply} this is another argument which can be supplied to every generated function. It is defined by the @see ICppFnManager
 */
export type CppFnGenerator<Args extends CppArgs, Supply> = (vs: IVariableSupplier, args: CppFnInformation<Args>, supplyed: Supply)=>string;

/**
 * Defines the required arguments to register a CppFn (Typescript function generator) to the CppFnManager.
 * 
 * It includes
 * 
 * @param name the name of the function (Which may change in the actual code to prevent duplicated name issures)
 * @param types a mapping between the typescript arguments and cpp-types for those arguments
 * @param generator a typescript generator function which will eventually generate all the source code
 */
export type CppFnRequest<Args extends CppArgs, Supply> = {
    name: string,
    types: {[key in keyof Args]: CppType},
    generator: CppFnGenerator<Args, Supply>
}

/**
 * Defines what will be returned from a @see CppFnRequest it has
 */
export interface ICppFnHandle<Args extends CppArgs, Supply> {
    
    /**
     * Used to add a call to the function.
     * 
     * This is used to check during the function generation which arguments of the functions can be printed as values directly into the c++ source code and which ones actually need to be passed.
     */
    addCall(args: Args) : void;
    /**
     * Returns the actual name of the function (After it has potentically been changed to prevent duplicated function names)
     */
    getName() : string;
}


/**
 * Defines a variable supplier which takes are of uniqueness of variable and also (counter to its name) function names.
 */
export interface IVariableSupplier {
    /**
     * Takes in 
     * @param name a variable (or function) name
     * 
     * @returns the same variables (or function) name, tho maybe changed to prevented variable name clashing 
     */
    register(name: string) : string;
} 

/**
 * Defines the result returned by the cpp-generator
 */
export type CppResult = {
    /**
     * The c++ source code of the generated functions
     */
    code: string,
    /**
     * A call generator which can generate calls to the generated function.
     * @see ICppFnCallGenerator for more info
     */
    callGenerator: ICppFnCallGenerator
}

/**
 * Defines an interface to generate strings which would call the desired (and previously registered) c++ function.
 */
export interface ICppFnCallGenerator {
    /**
     * Generates a call to a previously defined c++ function.
     * It takes
     * @param fn the function-reference which was previously given by registering a function using the @see ICppFnManager#addFunction 
     * @param call the actual values with which the function shall be called
     * 
     * @returns a string which will call the function.
     */
    getCallFor<Args extends CppArgs, Supply>(fn: ICppFnHandle<Args, Supply>, call: Args) : string;
}

/**
 * Defines the interface to register functions and finally generate the code.
 * 
 * Here is an example on how to use it properly
 * 
 * @type {Supply} is one argument which can be supplied to the generation functions. It will be passed to the @see ICppFnManager#generate method and passed down to the generator functions which generate the actual c++ code 
 * 
 * @example
 * 
 * let cppGen: ICppFnManager = ...;
 * 
 * ///
 * /// Step 1: Define the type for the options and define the generator function
 * ///
 * 
 * // The options that can be passed to the function SetLedX
 * type SetLedXOptions = {
 *     led: number, // Positiv integer
 *     r: number, // Integer between 0 and 255
 *     g: number, // Integer between 0 and 255
 *     b: number  // Integer between 0 and 255
 * }
 * 
 * // Generates the code for the led
 * function generateSetLedX(vs: IVariableSupplier, {r,g,b,led}: CppFnInformation<SetLedXOptions>) : string {
 * 
 *     // Registers a function local variable
 *     let calc = vs.register("calcResult");
 * 
 *     // Generates and returns the actual code
 *     // Note that string interpolation can be used
 *     return `
 *         // Simple calculation to calculate the HEX Code of the colors from their single values
 *         int ${calc} = ${r} << 16 & ${g} << 8 & ${b};
 * 
 *         // Calls other func to the set led
 *         setLed(${led}, ${calc});
 *     `;
 * }
 * 
 * ///
 * /// Step 2: Register the function to the cpp generator
 * ///
 * 
 * // Registers the function to the generator
 * let ref2SetLedX = cppGen.addFunction<SetLedXOptions>({
 *     // Name of the function (NOTE: This may be different in the source code)
 *     name: "setLedX",
 * 
 *     // The typescript function to print the string with the cpp function
 *     generator: generateSetLedX,
 *     
 *     // Registers the type mappings which are later on used to generate the source code
 *     types: {
 *         led: CppType.INT,
 *         r: CppType.INT,
 *         g: CppType.INT,
 *         b: CppType.INT,
 *     }
 * });
 * 
 * ///
 * /// Step 3: Register all calls to that function
 * ///
 * 
 * let call_1: SetLedXOptions = { led: 0, r: 200, b: 0, g: 0 };
 * let call_2: SetLedXOptions = { led: 1, r: 0, b: 100, g: 0 };
 * 
 * ref2SetLedX.addCall(call_1);
 * ref2SetLedX.addCall(call_2);
 * 
 * ///
 * /// Step 4: Generate the code of the c++ functions
 * ///
 * 
 * let result = cppGen.generate(...);
 * 
 * // Here is the function's code
 * // Note that g has been directly printed into the function because it was always the same
 * //
 * // void setLedX(int led, int r, int b){
 * //    ...
 * //    int calc = r << 16 & 0 << 8 & b;
 * //    ...
 * //    setLed(led, calc);
 * // }
 * //
 * const code = result.code;
 * 
 * ///
 * /// Step 5: Generate the calls to that function
 * ///
 * 
 * // Here are now the calls:
 * // Note that g has been excluded
 * //
 * // setLedX(0,200,0);
 * // setLedX(1,0,100);
 * //
 * let calls = [
 *     result.callGenerator.getCallFor(ref2SetLedX, call_1),
 *     result.callGenerator.getCallFor(ref2SetLedX, call_2)
 * ].join("\n");
 */
export interface ICppFnManager<Supply> {
    /**
     * Registers/adds a function to the generator. Use the returned reference @see ICppFnHandle to register all calls to the function before generating code.
     * @param request the data required to register a function. @see CppFnRequest
     */
    addFunction<Args extends CppArgs>(request: CppFnRequest<Args, Supply>) : ICppFnHandle<Args, Supply>;

    /**
     * Used after all calls to the added/registered function have been added to their references.
     * 
     * Generates the actual function code and the generator result.
     * 
     * @see CppResult for more info.
     */
    generate(supply: Supply) : CppResult;
}
