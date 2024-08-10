import { ICodeSupport } from "@cppgen/generator";
import { CppFnArgInformation } from "../definitions/CppFnDefinitions";

export type TrinaryResult = string | (()=>string);

// TODO: Comment
export function trinaryEquasion(value: CppFnArgInformation<boolean>, a: TrinaryResult, b: TrinaryResult){
    
    const getA = ()=>typeof a === "string" ? a : a();
    const getB = ()=>typeof b === "string" ? b : b();

    return (
        value.available ? (
            value.value ? getA() : getB()
        ) : `${value} ? ${getA()} : ${getB()}`
    )
}

/**
 * Takes in either a string or a string[] and tabs the strings all by a given amount of spaces
 * @returns the same string or string[]
 */
export function tab<T extends string | string[]>(code: T, spaces: number = 4) : T{
    const empty = new Array(spaces + 1).join(" ");
    
    if(!Array.isArray(code))
        return empty + code as T;
    return code.map(x=>empty+x) as T;
}

// TODO: Comment
export function delayIf(delay: CppFnArgInformation<number>, gen: ICodeSupport, ignorePush: boolean = false) {
    
    if(delay.available){
        if(delay.value <= 0) return [];

        return [
            ...(ignorePush ? [] : [gen.pushLeds()]),
            gen.sleep(delay),
        ];
    }

    if(ignorePush)
        return [gen.sleep(delay)];

    return [
        `if(${delay} > 0) {`,
        ...tab([
            gen.pushLeds(),
            gen.sleep(delay),
        ]),
        `}`
    ]
}

// TODO: Comment
export function finalPush(delays: CppFnArgInformation<number>[], gen: ICodeSupport) {

    if(delays.every(d=>d.available && d.value <= 0))
        return [gen.pushLeds()];
    return "";
}