import { ICodeSupport } from "@cppgen/generator";
import { CppFnArgInformation } from "../definitions/CppFnDefinitions";

export type TrinaryResult = string | (()=>string);

/**
 * Takes in a value that may or may not be known at precompile time
 * and creates a trinary-operator lookup.
 * 
 * Meaning if it's known at precompile time, the return will be the direct value.
 * 
 * If it's not known, it will generate the same lookup to be put into the c-code.
 */
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

/**
 * Creates delay code only if the delay is not 0
 * 
 * This means that
 * If the delay is known at precompile time:
 * - it will print the delay (If it's > 0)
 * - it will remove the delay (If it's = 0)
 * 
 * If not known, it will generate this check for runtime.
 *
 * Usually before a delay, an led push is also added to not keep the display dirty.
 * 
 * but if ignorePush is true, it prevents an led push before the delay.
 * @returns 
 */
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

/**
 * Takes in multiple possible delays and only adds an led push if every led is available and greater than 0
 */
export function finalPush(delays: CppFnArgInformation<number>[], gen: ICodeSupport) {

    // TODO: Probably change to a incode if(...){LEDPush} too

    if(delays.every(d=>d.available && d.value <= 0))
        return [gen.pushLeds()];
    return[
`if(${delays.map(x=>`${x} <= 0`).join(" && ")})
    ${gen.pushLeds()}
`];
}