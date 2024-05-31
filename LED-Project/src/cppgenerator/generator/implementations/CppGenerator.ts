import { IProcedure, ProcedureOptions, ProcedureWithOptions } from "src/procedure/definitions/Procedure";
import { CodeGenerationType, GenerationSettings, GetFnHandleByName, ICodeSupport, ICppGenerator, IExtendedCodeSupport } from "../definitions/CppGeneratorDefinitions";
import { CppFnManager } from "@cppgen/functionManager";
import VariableSupplier from "@cppgen/functionManager/implementations/VariableSupplier";
import { CodeSupport, ExtendedCodeSupport } from "./CodeSupport";
import { setSpaces } from "@cppgen/functionManager/utils/CodeShifter";


export class CppGenerator implements ICppGenerator {

    generate(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], settings: GenerationSettings): string {
        
        const varSup = new VariableSupplier();
        const funcManager = new CppFnManager<ICodeSupport>(varSup);
        
        // 1. Register all functions and get the mapper from the procedures

        // Gets a list with all used procedures and their calls
        const fnMapByProcName = registerFunctions([...setup, ...loop], funcManager);

        // 2. Generate function code
        
        // Creates the code support for the functions
        const codeSupport: ICodeSupport = new CodeSupport(settings, varSup);
        
        // Generates the c++ function code
        const funcGenerationResult = funcManager.generate(codeSupport);
        
        
        // 3. Generate setup / loop
        
        // Creates the extended code support
        const extCodeSupport: IExtendedCodeSupport = new ExtendedCodeSupport(settings, varSup, funcGenerationResult.callGenerator, fnMapByProcName);

        // Generates the setup and loop codes
        const setupResult = extCodeSupport.generateCodeForProcedures(setup, false, CodeGenerationType.Setup);
        const loopResult = extCodeSupport.generateCodeForProcedures(loop, setupResult.dirtyState, CodeGenerationType.Loop);

        // Generates the variable object
        
        const variables = { ...settings.variables };

        // Overwrites the reserved variables
        variables["setup"] = setupResult.code;
        variables["loop"] = loopResult.code;
        variables["globals"] = funcGenerationResult.code;

        if(loopResult.dirtyState && settings.loopPushLeds)
            variables["loop"] += "\n"+extCodeSupport.pushLeds();

        // Moves the template to zero
        let template = setSpaces(settings.template, 0);

        // Inserts the variables into the template
        return insertVariables(template, variables).replaceAll(/\n[\n \t]*\n{2,}/g, "\n");
    }
}

/**
 * Inserts variables into a template string, replacing placeholders with corresponding values.
 * 
 * This method takes a template string containing placeholders in the format "$$variableName$$" 
 * and replaces each placeholder with the corresponding value from the provided variables object. 
 * It also ensures that the inserted values maintain the same indentation as the placeholders 
 * within the template string.
 * 
 * @param template The template string containing placeholders to be replaced.
 * @param variables An object containing key-value pairs, where keys represent variable names 
 *                  and values represent the values to replace the placeholders with.
 * @returns The modified template string with placeholders replaced by their corresponding values.
 */
function insertVariables(template: string, variables: {[varName: string]: string}): string {
    function insertVariablesIntoLine(line: string): string {
        let parts = line.split(/\$\$/g);

        // If there's only one or no variable placeholders, return the original line
        if (parts.length <= 1)
            return line;

        // Ensure the length is always an odd number (non-divisible by two)
        if ((parts.length & 1) === 0)
            return line;

        // If more than one variable is given, replace placeholders with variable values
        if (parts.length > 3)
            return parts.map((part, idx) => {
                // If it's a string element (idx divisible by 2), keep it unchanged
                if ((idx & 1) === 0)
                    return part;
                // Otherwise, replace the placeholder with the corresponding variable value
                return variables[part] || "";
            }).join("");

        // Case: Only one variable exists
        let valueAsString = variables[parts[1]] || "";
        let previousData = parts[0];
        let next = parts[2];

        // Get the number of characters before the variable placeholder
        let spaceBefore = new Array(previousData.length + 1).join(" ");

        // Indent the inserted value with the same number of spaces as before the placeholder
        let insertedValue = valueAsString.split("\n").map((part, idx) => {
            return idx === 0 ? part : spaceBefore + part;
        }).join("\n");

        // Construct the string
        return `${previousData}${insertedValue}${next}`;
    }

    // Split the template by lines, insert variables, and join the lines back together
    return template.split("\n").map(insertVariablesIntoLine).join("\n");
}


// TODO: Export to other file (Because its public now)
/**
 * Registers functions for all base procedures and their subprocedures, and returns a lookup table of function handles by procedure names.
 * 
 * This function iterates over all base procedures and their subprocedures to register their functions with the given function manager.
 * It then creates a lookup table where each key is a procedure name, and the corresponding value is an array of function handles.
 * 
 * @param base The base procedures with their options.
 * @param fnManager The function manager to register the functions with.
 * 
 * @see CodeConstructor#registerFunctions
 * 
 * @returns A lookup table where each key is a procedure name, and the value is an object of function handles as defined by the procedures code constructor.
 */
export function registerFunctions(base: ProcedureWithOptions<any>[], fnManager: CppFnManager<ICodeSupport>) : GetFnHandleByName {

    // Define a type for storing procedures along with their calls
    type ProcMapping<Options extends ProcedureOptions> = { proc: IProcedure<Options>, calls: Options[] };

    // Initialize an array to store all procedure mappings
    let allCalls : ProcMapping<any>[] = [];

    // Function to recursively register calls for each procedure and its subprocedures
    function registerCalls({options, procedure}: ProcedureWithOptions<any>){
        // Find the index of the procedure mapping in the array
        let idx = allCalls.findIndex(mapping => mapping.proc === procedure);

        // Register the call and procedure
        if (idx === -1)
            allCalls.push({ proc: procedure, calls: [options] });
        else
            allCalls[idx].calls.push(options);

        // Recursively register subprocedures
        procedure.findSubprocedures(options).forEach(registerCalls);
    }

    // Register calls for each base procedure
    base.forEach(registerCalls);

    // Initialize an object to store function handles by procedure names
    let mappingByProcedurename: GetFnHandleByName = {};

    // Register functions and store them in the mapping object
    allCalls.forEach(({calls, proc})=>{
        mappingByProcedurename[proc.name] = proc.getCodeConstructor().registerFunctions(fnManager, calls);
    });

    return mappingByProcedurename;
}