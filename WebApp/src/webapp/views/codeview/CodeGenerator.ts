import { CodeHooks, CppGenerator, ICppGenerator } from "@cppgen/generator";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { replaceVariables } from "@utils/StringUtils";
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

    obj["ledInclude"] = store.ledSystemHooks.includeCode;
    obj["ledGlobal"] = store.ledSystemHooks.globalCode;
    obj["ledSetup"] = store.ledSystemHooks.setupCode;

    return obj;
}

function prepareCodeHooks() {
    const projStore = useProjectStore();

    const hooks: CodeHooks = {
        loop: (code: string, count: number) => replaceVariables(projStore.hooks.loop, { code, count }),
        setup: (code: string, count: number) => replaceVariables(projStore.hooks.setup, { code, count }),
        millis: () => projStore.hooks.millis,
        pushLeds: () => replaceVariables(projStore.hooks.pushleds, { code: projStore.ledSystemHooks.pushleds }),
        setHSV: (idx: number | string, hue: number | string, saturation: number | string, value: number | string) => {
            // Gets the raw code from the led system
            const rawFromSys = replaceVariables(projStore.ledSystemHooks.sethsv, { idx, hue, saturation, value });

            // Inserts it into the raw code
            return replaceVariables(projStore.hooks.sethsv, { code: rawFromSys });
        },
        sleep: (time: number | string) => replaceVariables(projStore.hooks.sleep, { time })
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