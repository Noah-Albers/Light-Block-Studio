
import { CppArgs, CppFnArgInformation, ICppFnHandle } from "@cppgen/functionManager";
import { CC_CppFnHandles } from "src/procedure/definitions/ProcCodeConstructor";
import { ProcedureWithOptions } from "src/procedure/definitions/Procedure";

/**
 * Holds hooks to change how specific portions of the code are generated from the outside
 */
export type CodeHooks = {
    // Used to pushed leds to the "led" screen
    pushLeds: ()=>string,

    // Used to create a delay of "time" milliseconds
    sleep: (time: number|string)=>string,

    /**
     * Used to set the led at index
     * @param idx to the HSV color of
     * @param h hue (0-255)
     * @param s saturation (0-255)
     * @param v value (0-255)
     */
    setHSV: (idx: number|string, h:number|string, s:number|string,v:number|string)=>string,

    // In-Program getter to get how many milliseconds have passed since the program started. Useful for creating over time animations
    millis: ()=>string,

    /**
     * Around every "line" (meaning code generated from a single module) 
     * this is generated. Can be used to implement custom logic that switches between lines
     * @param code the actual code of the line
     * @param count an incrementing index which keeps track on which instruction index the current one is
     */
    setup: (code: string, count: number)=>string,
    loop: (code: string, count: number)=>string,
}

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
    variables: {[key: string]: string},

    /**
     * Hooks are used to influence how specific code is generated or inserted into the final piece.
     * @example
     * ```
     * Hooking setLedHSV(index, hue, saturation, value)
     * 
     * Change from `leds[$$index$$] = CHSV($$hue$$, $$saturation$$, $$value$$)`
     * 
     * to `myCustomHandler($$index$$, $$hue$$, $$saturation$$, $$value$$)`
     * ```
     */
    hooks: CodeHooks,

    // If a single push shall be added at the loop end (If the leds are dirty)
    loopPushLeds: boolean,

    // If set, multiple empty lines will be trimmed down to a single one, improving code readability
    trimEmptyLines: boolean,

    // List of keywords that are reserved and shall not be used used by any variable or function as a name
    reservedKeywords: string[],
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

export type VariableNumber = number | string | CppFnArgInformation<number>;

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
    sleep(ms: VariableNumber): string;

    /**
     * Generates code to set the x-th LED to the specified RGB color value.
     * 
     * @param idx The index of the LED.
     * @param h the hue component of the color (0-1), except if its a variable string, then 0-255 (Integer)
     * @param s the saturation component of the color (0-1), except if its a variable string, then 0-255 (Integer)
     * @param v the value component of the color (0-1), except if its a variable string, then 0-255 (Integer)
     * @returns The generated code to set the LED color.
     */
    setLedHSV(idx: VariableNumber, h: VariableNumber, s: VariableNumber, v: VariableNumber): string;

    /**
     * Generates code to push all set LED states to the stripe to be displayed.
     * 
     * @returns The generated code to push LED states to the stripe.
     */
    pushLeds(): string;

    /**
     * Generates code which gives (In Cpp) back a long that holds how many milliseconds it has been since th controller started.
     * This can be used to implement over time changing animations
     */
    millis(): string;
}

// Defines which type is code is currently being generated. Usually normal is correct
export enum CodeGenerationType {
    Normal,
    Setup,
    Loop
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
     * @param type holds were the requested code is used. Leave this as undefined if you are not sure.
     * @returns An object containing generated code and the dirty state flag.
     */
    generateCodeForProcedures(chain: ProcedureWithOptions<any>[], dirtyState: boolean, type?: CodeGenerationType): CodeResult;
}

/**
 * Retrieves a C++ function handles by a procedure's name.
 * 
 * Returns an object where each key represents a procedure name, and the corresponding value 
 * is a C++ function handle or an array of handles.
 */
export type GetFnHandleByName = {[procedureName: string]: CC_CppFnHandles<any>};