
// TODO: Comment

export type CppArgs = {[key: string]: number | boolean | string}

export enum CppType {
    INT = "int",
    FLOAT = "float",
    BOOLEAN = "bool",
    DOUBLE = "double",
    CHAR = "char"
}

export type CppFnArgInformation<Value> = {
    available: true,
    value: Value,
    toString() : string
} | {
    available: false,
    value: string,
    toString() : string
}

export type CppFnInformation<Args extends CppArgs> = {[key in keyof Args]: CppFnArgInformation<Args[key]>}

export type CppFnGenerator<Args extends CppArgs> = (vs: IVariableSupplier, args: CppFnInformation<Args>)=>string;

export type CppFnRequest<Args extends CppArgs> = {
    name: string,
    types: {[key in keyof Args]: CppType},
    generator: CppFnGenerator<Args>
}

export interface IPreCppFn<Args extends CppArgs> {
    addCall(args: Args) : void;
    getName() : string;

    internal_getAllCalls() : Args[];
    internal_getTypeMappings() : {[key in keyof Args]: CppType};
    internal_getGenerator() : CppFnGenerator<Args>;
}


export interface IVariableSupplier {
    register(name: string) : string;
} 

export type CppResult = {
    code: string,
    callGenerator: ICppFnCallGenerator
}

export interface ICppFnCallGenerator {
    getCallFor<Args extends CppArgs>(fn: IPreCppFn<Args>, call: Args) : string;
}

export interface ICppGenerator {
    addFunction<Args extends CppArgs>(request: CppFnRequest<Args>) : IPreCppFn<Args>;
    generate() : CppResult;
}
