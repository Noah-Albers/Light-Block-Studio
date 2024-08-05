import { CppFnManager } from "@cppgen/functionManager";
import { CppFnHandle } from "@cppgen/functionManager/implementations/CppFnHandle";
import VariableSupplier from "@cppgen/functionManager/implementations/VariableSupplier";
import { GenerationSettings } from "@cppgen/generator";
import { CodeSupport, ExtendedCodeSupport } from "@cppgen/generator/implementations/CodeSupport";
import { registerFunctions } from "@cppgen/generator/implementations/CppGenerator";
import { ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { IProcedure, ProcedureOptions } from "@procedure/definitions/Procedure";
import { isObject } from "@test/TestUtils";

/**
 * Asserts that the result of evaluating runtime diagnostics is valid.
 * 
 * @param diagnostics The diagnostics object to use for runtime evaluation.
 * @param config The configuration options for the procedure.
 * @throws Error if the result of evaluating runtime diagnostics is not as expected.
 */
function assertEvaluateRuntime<Options extends ProcedureOptions>(diagnostics: IDiagnostics<Options>, config: Options) {
    const result = diagnostics.evaluateRuntime(config);

    // Check if the result is either a number or undefined
    if (!["number", "undefined"].includes(typeof result))
        throw new Error("evaluateRuntime of diagnostics doesn't return undefined or a number");

    // If the result is not a number, exit the function
    if (typeof result !== "number")
        return;

    // Check if the result is NaN
    if (isNaN(result))
        throw new Error("evaluateRuntime of diagnostics returned NaN. Return undefined if the runtime is unknown.");

    // Check if the result is negative
    if (result < 0)
        throw new Error(`evaluateRuntime of diagnostics returned negative number '${result}'`);
}

/**
 * Asserts that the result of finding all accessed LEDs is a set of positive integers (including zero).
 * 
 * @param diagnostics The diagnostics object to use for finding accessed LEDs.
 * @param config The configuration options for the procedure.
 * @throws Error if the result of finding accessed LEDs is not as expected.
 */
function assertFindAllAccessedLeds<Options extends ProcedureOptions>(diagnostics: IDiagnostics<Options>, config: Options) {
    const result = diagnostics.findAllAccessedLeds(config);

    // Check if the result is a Set
    if (!(result instanceof Set))
        throw new Error(`findAllAccessedLeds of diagnostics didn't return a set, but ${typeof result}`);

    // Check each item in the Set for being a positive integer (including zero)
    for (let item of result) {
        if (!Number.isInteger(item))
            throw new Error(`An item of the Set from findAllAccessedLeds() is not an integer but '${result}'`);
        if (item < 0)
            throw new Error(`An item of the Set from findAllAccessedLeds() is not positive: '${result}'`);
    }
}

/**
 * Asserts the validity of the diagnostics object.
 * 
 * @param procedure The procedure object for which diagnostics are being asserted.
 * @throws Error if the diagnostics object or its functions are not as expected.
 */
export function assertDiagnostics(procedure: IProcedure<any>) {
    const diag = procedure.getDiagnostics();

    // Validate that diagnostics is an object with required functions
    if (!isObject(diag))
        throw new Error("Diagnostics must be an object (Class instance)");

    // Validate that required functions are defined on diagnostics object
    const REQUIRED_FUNCTIONS = ["findAllAccessedLeds", "evaluateRuntime"];
    for (let funcName of REQUIRED_FUNCTIONS)
        if (typeof diag[funcName as keyof typeof diag] !== "function")
            throw new Error(`'${funcName}' is not defined on diagnostics object`);

    // Assert the results of evaluating runtime and finding accessed LEDs
    assertEvaluateRuntime(procedure.getDiagnostics(), procedure.getExampleConfig());
    assertFindAllAccessedLeds(procedure.getDiagnostics(), procedure.getExampleConfig());
}