import { CodeHooks, CppGenerator, ICppGenerator } from "@cppgen/generator";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";

const generator: ICppGenerator = new CppGenerator();

function getVariables() {
    const varStore = useVariableStore();

    const obj: { [key: string]: string } = {};

    for (let name in varStore.variable2ValueMap)
        obj[name] = varStore.variable2ValueMap[name].toString();

    // Project store
    const store = useProjectStore();

    // Adds some default overwrites
    obj["pin"] = (store.pin || 0).toString()
    obj["amt"] = (store.amount || 0).toString()

    return obj;
}

function prepareCodeHooks() {
    const projStore = useProjectStore();

    // Simple function that replaces variables inside a string with their values
    function RP(base: string, replacements: { [key: string]: number | string }) {
        for (let rep in replacements)
            base = base.replaceAll(`$$${rep}$$`, replacements[rep].toString());

        return base;
    }

    const hooks: CodeHooks = {
        loop: (code: string, count: number) => RP(projStore.hooks.loop, { code, count }),
        setup: (code: string, count: number) => RP(projStore.hooks.setup, { code, count }),
        millis: () => projStore.hooks.millis,
        pushLeds: () => projStore.hooks.pushleds,
        setHSV: (idx: number | string, hue: number | string, saturation: number | string, value: number | string) => RP(projStore.hooks.sethsv, { idx, hue, saturation, value }),
        sleep: (time: number | string) => RP(projStore.hooks.sleep, { time })
    }

    return hooks;
}

/**
 * Wrapper for the cpp generator to have the ability to generate the code from anywhere in the application easily
 */
export function generateCode(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[]): string {
    const store = useProjectStore();

    return generator.generate(setup, loop, {
        variables: getVariables(),
        template: store.codeBlueprint,
        hooks: prepareCodeHooks(),
        loopPushLeds: store.loopPushLeds,
        trimEmptyLines: store.trimEmptyLines,
        reservedKeywords: store.usedReservedKeywords
    })
}