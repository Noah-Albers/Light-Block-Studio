import { CppFnManager } from "@cppgen/functionManager";
import { CppFnHandle } from "@cppgen/functionManager/implementations/CppFnHandle";
import VariableSupplier from "@cppgen/functionManager/implementations/VariableSupplier";
import { GenerationSettings } from "@cppgen/generator";
import { CodeSupport, ExtendedCodeSupport } from "@cppgen/generator/implementations/CodeSupport";
import { registerFunctions } from "@cppgen/generator/implementations/CppGenerator";
import { ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { IProcedure, ProcedureOptions } from "@procedure/definitions/Procedure";
import { isObject } from "@test/TestUtils";


function testCodeConstructor(presumedCodeConstructor: ICodeConstructor<any>, procedure: IProcedure<any>, options: ProcedureOptions){

    let varSup = new VariableSupplier();
    let cppFnManager = new CppFnManager(varSup);
    let settings: GenerationSettings = {
        template: "",
        variables: {},
        hooks: {
            loop(code, count) { return code },
            millis(){ return "millis()" },
            pushLeds() { return "pushLeds()" },
            setHSV(idx, h, s, v) { return `leds[${idx}] = CHSV(${h},${s},${v})` },
            setup(code, count) { return code },
            sleep(time) { return `delay(${time})` },
        },
        loopPushLeds: true,
        reservedKeywords: [],
        trimEmptyLines: false
    };

    // Tries to register functions
    let result = presumedCodeConstructor.registerFunctions(cppFnManager, [options]);

    // Ensures it's an object
    if(!Array.isArray(result))
        throw new Error(`registerFunctions() didn't return an array, but ${typeof result}`);

    // Validates every returned object
    function assertCppFnHandle(handle: string, obj: any) {
        if(!isObject(obj))
            throw new Error(`registerFunctions().${handle} is not a ICppFnHandle`);

        // Performs further validation if it's of a known type
        if(!(obj instanceof CppFnHandle))
            return;

        // Validates that at least some calls were added
        if(obj.internal_getAllCalls().length <= 0)
            throw new Error(`registerFunctions() didn't add any calls to '${handle}'. Did you forgot to call #addCall()?`);
    }

    // Validates the all functions that were registered, are valid
    for(let funcHandle in result)
        assertCppFnHandle(funcHandle, result[funcHandle as keyof typeof result]);

    
    // Creates the support tools to generate code
    const normalCodeSupport = new CodeSupport(settings, varSup);
    const fnResult = cppFnManager.generate(normalCodeSupport);
    const fnByName = registerFunctions([{
        options,
        procedure
    }], cppFnManager)
    const supportTool = new ExtendedCodeSupport(settings,varSup,fnResult.callGenerator,fnByName);

    // Tries to generate code
    const codeGenResult = presumedCodeConstructor.constructCode(options, supportTool,result,false);

    if(!isObject(codeGenResult))
        throw new Error(`constructCode() return must be an object but is ${typeof codeGenResult}`);

    if(typeof codeGenResult.code !== "string")
        throw new Error(`constructCode().code must be a string but is ${typeof codeGenResult.code}`);
    if(typeof codeGenResult.dirtyState !== "boolean")
        throw new Error(`constructCode().dirtyState must be a boolean but is ${typeof codeGenResult.dirtyState}`);
}

/**
 * Validates the codeconstructor of a procedure
 * 
 * @requires procedure to be validated beforehand and to let its functions return what they are supposed to
 * @param procedure the procedure of which the code constructor shall be validated
 */
export function assertCodeConstructor(procedure: IProcedure<any>) {

    let obj = procedure.getCodeConstructor() as any;

    // Ensures it's an object
    if(!isObject(obj))
        throw new Error("CodeConstructor isn't an object");


    // Validates some functions to be functions
    const REQUIRED_FUNCTIONS = ["registerFunctions", "constructCode"];

    for(let funcName of REQUIRED_FUNCTIONS){
        if(typeof obj[funcName] !== "function")
            throw new Error(`'${funcName}' is not defined on CodeConstructor`);
    }
    testCodeConstructor(obj, procedure, procedure.getExampleConfig());
}
