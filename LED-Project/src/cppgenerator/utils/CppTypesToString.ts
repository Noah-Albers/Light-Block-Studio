import { CppType } from "../Types";

function booleanToString(value: unknown) : string {
    if(typeof value !== "boolean")
        throw new Error(`Value ${value} is not a boolean`);

    return value === true ? "true" : "false";
}
function charToString(value: unknown) : string {
    if(typeof value !== "string" || value.length !== 1)
        throw new Error(`Value ${value} is not a char`);

    return value;
}
function doubleAndFloatToString(value: unknown) : string {
    if(typeof value !== "number")
        throw new Error(`Value '${value}' is not a number`);

    return value.toString();
}
function intToString(value: unknown) : string {
    if(typeof value !== "number" || Number.isInteger(value))
        throw new Error(`Value '${value}' is not an integer`);
    
    return value.toString();
}

/**
 * Takes in a cpp-type and the value that shall be turned into one and prints it into a string
 * @param type 
 * @param value 
 * @returns 
 * @throws {Error} if the type or value don't match each other. For example with type = CppType.boolean, value = 3.14
 */
export default function cppTypeToString(type: CppType, value: unknown) : string{

    switch(type){
        case CppType.BOOLEAN:
            return booleanToString(value);
        case CppType.CHAR:
            return charToString(value);
        case CppType.DOUBLE: case CppType.FLOAT:
            return doubleAndFloatToString(value);
        case CppType.INT:
            return intToString(value);
        default:
            throw new Error(`Unknown CppType '${type}'`);
    }
}