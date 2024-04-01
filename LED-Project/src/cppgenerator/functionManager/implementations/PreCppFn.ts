import { CppArgs, CppFnGenerator, CppType, IPreCppFn } from "../definitions/CppFnDefinitions";

export class PreCppFn<Args extends CppArgs> implements IPreCppFn<Args> {

    // Holds all list with all arguments that may be passed to the
    private allCalls: Args[] = [];

    // Name of the function
    private name: string;

    // Mappings from arg names to their cpp types
    private typeByName: {[key in keyof Args]: CppType};

    // Body/Cpp-Function generator
    private functionGenerator: CppFnGenerator<Args>;

    constructor(name: string, typeByName: {[key in keyof Args]: CppType}, funcGenerator: CppFnGenerator<Args>){
        this.name = name;
        this.typeByName = typeByName;
        this.functionGenerator = funcGenerator;
    }

    public addCall(args: Args): void {
        this.allCalls.push(args);
    }

    public getName(): string {
        return this.name;
    }

    public internal_getAllCalls(): Args[] {
        return this.allCalls;
    }
    public internal_getTypeMappings(): { [key in keyof Args]: CppType; } {
        return this.typeByName;
    }
    public internal_getGenerator(): CppFnGenerator<Args> {
        return this.functionGenerator;
    }

}