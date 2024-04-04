
import { CppFnRequest, ICppFnHandle, ICppFnManager, CppResult, CppType, CppFnGenerator, CppArgs, ICppFnCallGenerator, IVariableSupplier } from "../definitions/CppFnDefinitions";
import { CppFnCallGenerator } from "./CppFnCallGenerator";
import { CppFnHandle } from "./CppFnHandle";
import VariableSupplier from "./VariableSupplier";
import generateCppFunctionCode from "../utils/GenerateCppFunction";

export class CppFnManager<Supply> implements ICppFnManager<Supply> {

    // Used for variable generation
    private variableHolder : IVariableSupplier;

    // List of generated functions
    private preFunctions: CppFnHandle<any, Supply>[] = [];

    constructor(varSup: IVariableSupplier | undefined = undefined){
        this.variableHolder = varSup === undefined ? new VariableSupplier() : varSup;
    }

    public addFunction<Args extends CppArgs>(request: CppFnRequest<Args, Supply>): ICppFnHandle<Args, Supply> {
        // Generates a unique function name
        let fnName = this.variableHolder.register(request.name);
        let preFunc = new CppFnHandle<Args, Supply>(fnName, request.types, request.generator);

        // Adds the generated pre-func to the internal list
        this.preFunctions.push(preFunc);

        return preFunc;
    }

    public generate(supply: Supply): CppResult {
        
        // Generates the code for all functions that got registered
        let generationResults = this.preFunctions.map(func=>generateCppFunctionCode(this.variableHolder, func, supply));

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