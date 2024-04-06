
import { CppArgs, ICppFnHandle } from "@cppgen/functionManager";
import { CC_CppFnHandles } from "src/procedure/definitions/ProcCodeConstructor";
import { ProcedureWithOptions } from "src/procedure/definitions/Procedure";

/**
 * Settings which are passed to the cpp generator
 */
export type GenerationSettings = {
    /**
     * Template code string
     * 
     * This property stores the template code string. It should contain placeholders in the form of $$variableName$$
     * that will be replaced with corresponding values during code generation.
     * 
     * The placeholders $$global$$, $$setup$$, and $$loop$$ are reserved, and their values will be replaced
     * with the contents of the 'setup' and 'loop' procedures when generating the code.
     * 
     * Any other placeholders used in the template that are not defined within the 'variables' dictionary
     * will be left blank in the generated code.
     * 
     * @example
     * 
     * For example, consider the following template:
     * 
     * ```
     * #define CONFIG_VALUE_1 $$config_value$$
     * #define CONFIG_VALUE_2 $$config_value_undefined$$
     * 
     * $$global$$
     * 
     * void setup(){
     *      $$setup$$
     * }
     * 
     * void loop(){
     *      $$loop$$
     * }
     * ```
     * 
     * This could result in the following generated code:
     * 
     * ```
     * #define CONFIG_VALUE_1 15
     * #define CONFIG_VALUE_2
     * 
     * void setLedX(){...}
     * 
     * void setup(){
     *      delay(100);
     * }
     * 
     * void loop(){
     *      setLedX(10, 0);
     * }
     * ```
     */

    template: string,

    /**
     * Variables that can be used within the template with the syntax: $$variableName$$
     * 
     * The reserved values for "setup", "loop" and "global" will be ignored and overwritten.
     */
    variables: {[key: string]: string}
}

/**
 * The interface to generate c++ code.
 */
export interface ICppGenerator {

     /**
     * Generates the C++ code using the provided procedures.
     * 
     * @param setup Procedures to run during setup.
     * @param loop Procedures to run continuously in the main loop.
     * 
     * @param settings the settings that influence how to code is generated
     * 
     * @returns The generated C++ code that can be compiled.
     */
    generate(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], settings: GenerationSettings) : string;
}

/**
 * Represents a tuple containing generated source code and a dirty state flag.
 * 
 * This type combines the generated C++ source code in string form with a flag indicating 
 * whether there is remaining data to be processed and pushed to the stripe after the code execution.
 * 
 * @property {string} code - The generated C++ source code.
 * @property {boolean} dirtyState - A flag indicating if there is remaining data to be pushed to the stripe.
 */
export type CodeResult = {
    code: string,
    dirtyState: boolean
}

/**
 * Interface representing a supporting tool for code and function generators.
 * 
 * This interface serves as a central hub for various tools, offering wrapper methods 
 * to streamline common operations.
 */
export interface ICodeSupport {
    /**
     * Formats code by setting the spacing for each line (tabs) in the string.
     * 
     * @param code The code string to format.
     * @param tabs The number of spaces to use for each indentation level.
     * @returns The formatted code string.
     * @see CodeShifter#setSpaces for more info
     */
    setTabs(code: string, tabs: number) : string;
    
    /**
     * Requests a variable with a unique name.
     * 
     * @param name The base name for the variable.
     * @returns A unique variable name.
     * @see IVariableSupplier#register for more info
     */
    registerVariable(name: string): string;

    /**
     * Generates C++ code that sleeps for the specified number of milliseconds.
     * 
     * @param ms The duration of the sleep in milliseconds.
     * @returns The generated C++ code for the sleep operation.
     */
    sleep(ms: number | string): string;

    /**
     * Generates code to set the x-th LED to the specified RGB color value.
     * 
     * @param idx The index of the LED.
     * @param r The red component of the color.
     * @param g The green component of the color.
     * @param b The blue component of the color.
     * @returns The generated code to set the LED color.
     */
    setLed(idx: number | string, r: number | string, g: number | string, b: number | string): string;

    /**
     * Generates code to push all set LED states to the stripe to be displayed.
     * 
     * @returns The generated code to push LED states to the stripe.
     */
    pushLeds(): string;
}

/**
 * Extension of the code support interface, enhancing functionality for invoking registered C++ functions 
 * and generating code for sub-procedures.
 * 
 * This extension is particularly useful for handling procedures like while or for loops.
 */
export interface IExtendedCodeSupport extends ICodeSupport {
    /**
     * Calls a registered C++ function with the specified arguments and returns the generated code.
     * 
     * @param func The C++ function handle to call.
     * @param call The arguments to pass to the function.
     * @returns The generated C++ code resulting from the function call.
     */
    callFunction<Args extends CppArgs>(func: ICppFnHandle<Args, IExtendedCodeSupport>, call: Args): string;

    /**
     * Generates code for a chain of sub-procedures, considering the dirty state flag.
     * 
     * @param chain The chain of sub-procedures to generate code for.
     * @param dirtyState A flag indicating whether there is remaining data to be processed.
     * @returns An object containing generated code and the dirty state flag.
     */
    generateCodeForProcedures(chain: ProcedureWithOptions<any>[], dirtyState: boolean): CodeResult;
}

/**
 * Retrieves a C++ function handles by a procedure's name.
 * 
 * Returns an object where each key represents a procedure name, and the corresponding value 
 * is a C++ function handle or an array of handles.
 */
export type GetFnHandleByName = {[procedureName: string]: CC_CppFnHandles<any>};