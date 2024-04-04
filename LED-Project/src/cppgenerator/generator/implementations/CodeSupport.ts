import { CppArgs, ICppFnCallGenerator, ICppFnHandle, IVariableSupplier } from "@cppgen/functionManager";
import { CodeResult, GenerationSettings, GetFnHandleByName, ICodeSupport, IExtendedCodeSupport } from "../definitions/CppGeneratorDefinitions";
import { ProcedureWithOptions } from "src/procedure/definitions/Procedure";
import * as CodeShifter from "@cppgen/functionManager/utils/CodeShifter";

export class CodeSupport implements ICodeSupport{

    protected settings: GenerationSettings;
    protected vSup: IVariableSupplier;

    constructor(settings: GenerationSettings, vSup: IVariableSupplier){
        this.settings = settings;
        this.vSup = vSup;
    }

    public setTabs(code: string, tabs: number) : string {
        return CodeShifter.setSpaces(code, tabs);
    }

    public registerVariable(name: string) : string{
        return this.vSup.register(name);
    }

    public sleep(ms: number | string){
        return `delay(${ms});`;
    }

    public setLed(idx: number | string, r: number | string, g: number | string, b: number | string){
        return `leds[${idx}] = CRGB(${r},${g},${b});`;
    }

    public pushLeds(){
        return `FastLED.push();`;
    }
}

export class ExtendedCodeSupport extends CodeSupport implements IExtendedCodeSupport {
    
    protected callGenerator: ICppFnCallGenerator;
    protected fnMap: GetFnHandleByName;

    constructor(settings: GenerationSettings, vSup: IVariableSupplier, callGenerator: ICppFnCallGenerator, fnMap: GetFnHandleByName){
        super(settings, vSup);

        this.callGenerator = callGenerator;
        this.fnMap = fnMap;
    }
    
    callFunction<Args extends CppArgs>(func: ICppFnHandle<Args, IExtendedCodeSupport>, call: Args): string {
        return this.callGenerator.getCallFor<Args, ExtendedCodeSupport>(func, call);
    }

    generateCodeForProcedures(chain: ProcedureWithOptions<any>[], dirtyState: boolean): CodeResult {
        // Initialize the dirty state flag
        let isDirty = dirtyState;

        // Initialize an empty string to accumulate the generated code
        let fullCode = "";

        // Iterate over each procedure in the chain
        for (let { options, procedure } of chain) {
            // Retrieve the associated C++ functions registered by the procedure
            let associatedFunctions = this.fnMap[procedure.name];

            // Generate code for the current procedure
            let codeResult = procedure.getCodeConstructor().constructCode(
                options,
                this,
                associatedFunctions,
                isDirty
            );

            // Append the generated code to the full code string
            fullCode += this.setTabs(codeResult.code, 0) + "\n";

            // Update the dirty state based on the result of the code generation
            isDirty = codeResult.dirtyState;
        }

        // Return an object containing the generated code and the updated dirty state
        return {
            dirtyState: isDirty,
            code: fullCode
        };
    }
}