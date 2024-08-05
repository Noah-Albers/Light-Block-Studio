import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure";
import { IProcedure, ProcedureOptions } from "@procedure/definitions/Procedure";
import { isObject } from "@test/TestUtils";
import { assertCodeConstructor } from "./CodeConstructors.test";
import { assertDiagnostics } from "./Diagnostics.test";
import { assertLedNode } from "./LEDNode.test";


// TODO: Replace eventually when a full registry is implemented
const PROCEDURES_TO_TEST: IProcedure<any>[] = [
    new LoopProcedure()
]

type PathLike = string[];
type ErrorCreator = (msg: string, path: PathLike) => Error;

// Returns a function which returns a specfied error for a given subpath
function createErrorSupplyer(mainName: string): ErrorCreator {

    const getError = (msg: string, path: PathLike) => {
        return new Error(`Error within ${mainName}() Path: ${path.join("/")} ${msg}`);
    }

    return getError;
}

/**
 * Validates the findSubprocedures method
 * 
 * @requires getExampleConfig to be valid
 * @requires getExampleConfig to be very explicit and contain sub procedures
 * 
 * @throws {Error} if anything is invalid 
 */
function assert_findSubprocedures<Options extends ProcedureOptions>(proc: IProcedure<Options>, path: PathLike) {

    const getError = createErrorSupplyer("findSubprocedures");


    try {
        let config = proc.getExampleConfig();

        let result = proc.findSubprocedures(config) as any[];

        if (!Array.isArray(result))
            throw getError("is not an array", path);

        function assert_subprocedure(subProcWOptions: any, path: PathLike) {

            if (!isObject(subProcWOptions))
                throw getError("is not an object", path);

            let subProc = subProcWOptions["procedure"];
            let subOpts = subProcWOptions["options"];

            // Asserts the procedure
            assertProcedure(subProc, [...path, "procedure"]);

            // Asserts its options
            assert_ProcedureOptions(subOpts, [...path, "options"]);
        }

        for (let i = 0; i < result.length; i++)
            assert_subprocedure(result[i], [...path, `[${i}]`]);
    } catch (err) {
        throw new Error(`findSubprocedures() ${err}`);
    }
}

/**
 * Validates options to be an ProcedureOptions object
 */
function assert_ProcedureOptions(options: any, path: PathLike) {

    const getError = createErrorSupplyer("[Procedure Options]");

    if (options === undefined || options === null)
        throw getError("is null", path);

    // Ensures object
    if(!isObject(options))
        throw getError("is not an object", path);

    function assert_value(key: string, value: any, subPath: PathLike) {

        // Filters for the subelement
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                assert_ProcedureOptions(key[i], [...subPath, `${key}[${i}]`]);
            }
            return;
        }

        // Validates type
        if (!["string", "boolean", "number"].includes(typeof value))
            throw getError("is not of type string, boolea, number or ProcedureWithOptions[]", path);
    }

    // Validates every config item
    for (let configName in options)
        assert_value(configName, options[configName], [...path, configName]);
}

/**
 * Validates the #getExampleConfig method of a procedure
 * 
 * @requires proc to be validated to be a @see IProcedure object
 * @throws {Error} if anything is invalid 
 */
function assert_getExampleConfig(proc: IProcedure<any>, basePath: PathLike) {

    try {
        // Starts with the rood object
        assert_ProcedureOptions(proc.getExampleConfig(), basePath);

    } catch (err) {
        throw new Error(`getExampleConfig() ${err}`);
    }
}

/**
 * Asserts a full procedure object
 */
function assertProcedure(proc: any, path: PathLike) {

    const getError = createErrorSupplyer("[IProcedure]");

    // Is an object
    if(!isObject(proc))
        throw getError("Procedure must be an object (Class instance)", path);

    // Name is set
    if(typeof proc.name !== "string")
        throw getError("'name' property is not set", path);
    
    // Validates some functions to be functions
    const REQUIRED_FUNCTIONS = ["getExampleConfig", "findSubprocedures", "getDiagnostics", "getLEDNode"];

    for(let funcName of REQUIRED_FUNCTIONS){
        if(typeof proc[funcName] !== "function")
            throw getError(`'${funcName}' is not defined on procedure`,path);
    }

    // Validates the functions
    assert_getExampleConfig(proc, path);
    assert_findSubprocedures(proc, path);

    // Asserts the procedures code constructor
    try{
        assertCodeConstructor(proc);
    }catch(err){
        throw getError(`/CodeConstructor: ${err}`, path);
    }


    // Asserts the procedures diagnostics
    try{
        assertDiagnostics(proc);
    }catch(err){
        throw getError(`/Diagnostics: ${err}`, path);
    }


    // Asserts the led node diagnostics
    try{
        // TODO: Dont just ignore this promise. Maybe someday... well maybe
        assertLedNode(proc);
    }catch(err){
        throw getError(`/LEDNode: ${err}`, path);
    }

}

/**
 * Asserts some basic information about a procedure which can be used to debug some stuff
 * @param obj 
 * @returns 
 */
function assertProcedureBasicInfo(obj: any) : obj is {name: string} {

    // Is an object
    if(!isObject(obj))
        return false;

    // Name is set
    if(typeof obj.name !== "string")
        return false;

    return true;
}

export function runTest_registered_procedures() {
    // Iterates over all procedures
    for(let i=0;i<PROCEDURES_TO_TEST.length;i++){
        let procObj = PROCEDURES_TO_TEST[i];

        if(!assertProcedureBasicInfo(procObj)){
            throw new Error(`A registered Procedure at index [${i}] is not a procedure and doesn't even have a name.`);
        }

        // Asserts the procedure
        assertProcedure(procObj, [procObj.name]);
    }

    // Iterates over all procedures and tests it
    PROCEDURES_TO_TEST.forEach(proc=>assertProcedure(proc, []));
};