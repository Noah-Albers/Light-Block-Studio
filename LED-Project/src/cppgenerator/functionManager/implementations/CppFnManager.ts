
import { CppFnRequest, IPreCppFn, ICppFnManager, CppResult, CppType, CppFnGenerator, CppArgs, ICppFnCallGenerator, IVariableSupplier } from "../definitions/CppFnDefinitions";
import { CppFnCallGenerator } from "./CppFnCallGenerator";
import { PreCppFn } from "./PreCppFn";
import VariableSupplier from "./VariableSupplier";
import generateCppFunctionCode from "../utils/GenerateCppFunction";

export class CppFnManager implements ICppFnManager {

    // Used for variable generation
    private variableHolder : IVariableSupplier;

    // List of generated functions
    private preFunctions: PreCppFn<any>[] = [];

    constructor(){
        this.variableHolder = new VariableSupplier();
    }

    public addFunction<Args extends CppArgs>(request: CppFnRequest<Args>): IPreCppFn<Args> {
        // Generates a unique function name
        let fnName = this.variableHolder.register(request.name);
        let preFunc = new PreCppFn<Args>(fnName, request.types, request.generator);

        // Adds the generated pre-func to the internal list
        this.preFunctions.push(preFunc);

        return preFunc;
    }

    public generate(): CppResult {
        
        // Generates the code for all functions that got registered
        let generationResults = this.preFunctions.map(func=>generateCppFunctionCode(this.variableHolder, func));

        // Maps them to a lookup table for the required args for a function print call
        let requiredArgs : {[key: string]: string[]} = {};
        generationResults.forEach(res=>requiredArgs[res.name] = res.requiredArguments as string[]);

        // Creates the call generator
        let callGenerator = new CppFnCallGenerator(requiredArgs);

        // Creates the function code
        let code = generationResults.map(res=>res.code).join("\n");

        return {
            callGenerator,
            code
        }
    }
    
}