import { CppGenerator, ICppGenerator } from "@cppgen/generator";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";

const generator : ICppGenerator = new CppGenerator();

function getVariables(){
    const varStore = useVariableStore();

    const obj: {[key: string]: string} = {};

    for(let name in varStore.variable2ValueMap)
        obj[name] = varStore.variable2ValueMap[name].toString();

    // Adds some default overwrites
    obj["pin"] = useProjectStore().pin.toString()

    return obj;
}

/**
 * Wrapper for the cpp generator to have the ability to generate the code from anywhere in the application easily
 */
export function generateCode(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[]) : string {
    return generator.generate(setup, loop, {
        variables: getVariables(),
        template: useProjectStore().codeTemplate
    })
}