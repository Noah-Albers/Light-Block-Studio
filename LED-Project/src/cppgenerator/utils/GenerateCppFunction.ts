import { CppArgs, CppFnArgInformation, CppFnInformation, IPreCppFn, IVariableSupplier } from "../Types";
import { setSpaces } from "./CodeShifter";

/**
 * Takes in a function and all of it's calls and map it into an array of object which all have marked if their argument is called with different values or allways the same.
 * Further for those that are different also a variable name is registered and appended.
 * @param vsup 
 * @param calls 
 * @param arg 
 */
function mapArgumentsToSupplyInformation<Args extends CppArgs>(vsup: IVariableSupplier, calls: Args[], arg: keyof Args) {
    // Gets a base value
    let cmpValue = calls[0][arg];

    // Checks if every value is the same
    let allSame = calls.every(call=>call[arg] === cmpValue);

    if(allSame)
        return {
            available: true,
            value: cmpValue,
            name: arg as string
        }

    return {
        available: false,
        name: arg as string,
        variableName: vsup.register(arg as string)
    }
}

/**
 * This function is responsible for generating the Cpp-Fn source code from a
 * @param {PreCppFn} func pre-function
 * 
 * and some other metadata
 * 
 * @param vsup 
 * @param types 
 * @param funcGenerator 
 * 
 * @returns the cpp-function body and code that is generated AND a list with the names of all arguments that are not always the same
 * 
 * @example
 * ```
 * This turn for example a simple pre function into:
 * 
 * """
 * void doSmth(int abc){
 *  abc += 10;
 * }
 * """
 * ```
 */
export default function generateCppFunctionCode<Args extends CppArgs>(
    vsup: IVariableSupplier,
    func: IPreCppFn<Args>
) : {
    code: string,
    requiredArguments: (keyof Args)[],
    name: string
} {

    let calls = func.internal_getAllCalls();
    let types = func.internal_getTypeMappings();
    let funcGen = func.internal_getGenerator();

    if(calls.length <= 0) return {
        code: "",
        requiredArguments: [],
        name: func.getName()
    };

    // Groups all arguments into args that always are supplied with the same value and ones that are not
    let groupedArgs = Object.keys(calls[0]).map(arg=>mapArgumentsToSupplyInformation(vsup, calls, arg));

    // Generates the "brain" for the function
    let funcBrain = groupedArgs
        .filter(arg=>!arg.available)
        .map(arg=>`${types[arg.name]} ${arg.variableName!}`)
        .join(", ");

    // Maps them to the values for the function generator
    let funcGeneratorValues : {[key: string]: CppFnArgInformation<any>} = {};
    groupedArgs.forEach(arg=>{
        funcGeneratorValues[arg.name] = {
            available: arg.available,
            value: arg.available ? arg.value : arg.variableName,
            toString(){ return this.value; }
        } as CppFnArgInformation<any>;
    })

    let funcBody = setSpaces(funcGen(vsup, funcGeneratorValues as CppFnInformation<Args>), 4);

    // Generates the full cpp-function
    let code = [
        `void ${func.getName()}(${funcBrain}) {`,
        ...funcBody.split("\n"),
        `}`
    ].join("\n");

    // Filters all arguments that have multiple values (Therefor are required to be supplied with every function call)
    let requiredArguments = groupedArgs.filter(arg=>!arg.available).map(arg=>arg.name as keyof Args);

    // Generates the function
    return {
        code,
        requiredArguments,
        name: func.getName()
    }

}