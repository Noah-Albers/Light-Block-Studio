import { CppArgs, ICppFnCallGenerator, ICppFnHandle, IVariableSupplier } from "@cppgen/functionManager";
import { CodeGenerationType, CodeResult, GenerationSettings, GetFnHandleByName, ICodeSupport, IExtendedCodeSupport } from "../definitions/CppGeneratorDefinitions";
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
        return this.settings.hooks.sleep(ms);
    }

    public setLedHSV(idx: string | number, h: string | number, s: string | number, v: string | number): string {

        const iH = typeof h === "string" ? h : Math.round(h*255);
        const iS = typeof s === "string" ? s : Math.round(s*255);
        const iV = typeof v === "string" ? v : Math.round(v*255);

        return this.settings.hooks.setHSV(idx,iH,iS,iV);
    }

    public millis(): string {
        return this.settings.hooks.millis();
    }

    public pushLeds(){
        return this.settings.hooks.pushLeds();
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

    generateCodeForProcedures(chain: ProcedureWithOptions<any>[], dirtyState: boolean, type?: CodeGenerationType): CodeResult {
        // Initialize the dirty state flag
        let isDirty = dirtyState;

        // Initialize an empty string to accumulate the generated code
        let fullCode = "";

        if(type === undefined)
            type = CodeGenerationType.Normal;

        // Iterate over each procedure in the chain
        for(let i=0;i<chain.length;i++){
            let {options, procedure} = chain[i];

            // Retrieve the associated C++ functions registered by the procedure
            let associatedFunctions = this.fnMap[procedure.name];

            // Generate code for the current procedure
            let codeResult = procedure.getCodeConstructor().constructCode(
                options,
                this,
                associatedFunctions,
                isDirty
            );
            let code = codeResult.code;

            
            // Wraps the result in the user defined hook (If required)
            if(type !== CodeGenerationType.Normal)
                code = (type === CodeGenerationType.Setup ? this.settings.hooks.setup : this.settings.hooks.loop)(code, i);
            
            // Append the generated code to the full code string
            fullCode += this.setTabs(code, 0) + "\n";

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