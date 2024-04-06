import { CppArgs, CppFnGenerator, CppType, ICppFnHandle } from "../definitions/CppFnDefinitions";

/**
 * This handle is a reference which can later be used to generate calls to the actual c++ function.
 * 
 * Before that it is used to register all call parameters which will be used within the c++ program
 */
export class CppFnHandle<Args extends CppArgs, X> implements ICppFnHandle<Args, X> {

    // Holds all list with all arguments that may be passed to the
    private allCalls: Args[] = [];

    // Name of the function
    private name: string;

    // Mappings from arg names to their cpp types
    private typeByName: {[key in keyof Args]: CppType};

    // Body/Cpp-Function generator
    private functionGenerator: CppFnGenerator<Args, X>;

    constructor(name: string, typeByName: {[key in keyof Args]: CppType}, funcGenerator: CppFnGenerator<Args, X>){
        this.name = name;
        this.typeByName = typeByName;
        this.functionGenerator = funcGenerator;
    }

    public addCall(args: Args | Args[]): ICppFnHandle<Args, X> {
        if(Array.isArray(args))
            this.allCalls.push(...args);
        else
            this.allCalls.push(args);
        return this;
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
    public internal_getGenerator(): CppFnGenerator<Args, X> {
        return this.functionGenerator;
    }

}