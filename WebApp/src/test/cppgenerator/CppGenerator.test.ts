import { CppFnInformation, CppType } from "@cppgen/functionManager";
import { CppGenerator, ICodeSupport } from "@cppgen/generator";
import { assertStringsEqual } from "@test/TestUtils";
import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { IVisualisationController } from "@visualizer/definitions/VisualisationController";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { SimpleProcedure } from "@procedure/implementations/SimpleProcedure";




type FuncProcOptions = {
    a: number,
    b: number,
    c: number
}

// TODO: Move to exteral function to generate dummy diagnostics
class FuncDiagnostics implements IDiagnostics<FuncProcOptions> {
    evaluateRuntime(opts: FuncProcOptions): number | undefined { return 0; }
    findAllAccessedLeds(opts: FuncProcOptions): Set<number> { return new Set(); }
}

class FuncLedNode implements ILEDNode<FuncProcOptions> {
    async startNode(options: FuncProcOptions, ctrl: IVisualisationController): Promise<void> {}
}

class FuncCodeConstr extends SimpleFunctionCodeConstructor<FuncProcOptions> {

    getDirtyStateAfterExecution(options: FuncProcOptions, previousState: boolean): boolean {
        return true;
    }

    generateFunctionCode({a, b, c}: CppFnInformation<FuncProcOptions>, supplyed: ICodeSupport): string {
        let i = supplyed.registerVariable("i");
        
        return `
            int ${i} = ${a} + ${b};

            setLed(${c}, ${i});
        `;
    }

    getFunctionName(): string {
        return "Function"
    }

    getTypeMapping(): { a: CppType; b: CppType; c: CppType; } {
        return {
            a: CppType.INT,
            b: CppType.INT,
            c: CppType.INT
        }
    }
}

export function runTest_cppgenerator_codegenerator(){

    const FUNC_PROC = new SimpleProcedure<FuncProcOptions>("Func", new FuncCodeConstr(), new FuncDiagnostics(), new FuncLedNode(), { a: 1, b: 1, c: 1 });
    const LOOP_PROC = new LoopProcedure();



    const cppGen = new CppGenerator();

    const loop: ProcedureWithOptions<any>[] = [
        {
            procedure: LOOP_PROC,
            options: {
                repeats: 5,
                sub: [
                    { procedure: FUNC_PROC, options: { a: 2, b: 4, c: 7 } },
                    { procedure: FUNC_PROC, options: { a: 3, b: 4, c: 7 } },
                    { procedure: FUNC_PROC, options: { a: 4, b: 4, c: 7 } },
                    { procedure: FUNC_PROC, options: { a: 2, b: 1, c: 7 } },
                    {
                        procedure: LOOP_PROC,
                        options: {
                            repeats: 5,
                            sub: [
                                { procedure: FUNC_PROC, options: { a: 1, b: 1, c: 1 } },
                            ]
                        }
                    },
                ]
            }
        },
        { procedure: FUNC_PROC, options: { a: 2, b: 1, c: 7 } },
        { procedure: FUNC_PROC, options: { a: 2, b: 1, c: 7 } },
        { procedure: FUNC_PROC, options: { a: 2, b: 1, c: 7 } },
    ]

    let result = cppGen.generate([], loop, {
        template: `
            #include LED_AMT $$AMT$$

            //#region Globals
            $$globals$$
            //#endregion Globals

            void setup(){
                $$setup$$
            }

            void loop(){
                $$loop$$
            }
        `,
        variables: {
            "AMT": "30"
        },
        hooks: {
            loop(code, count) { return code },
            millis(){ return "millis()" },
            pushLeds() { return "pushLeds()" },
            setHSV(idx, h, s, v) { return `leds[${idx}] = CHSV(${h},${s},${v})` },
            setup(code, count) { return code },
            sleep(time) { return `delay(${time})` },
        },
        loopPushLeds: false,
        reservedKeywords: [],
        trimEmptyLines: true
    })

    const REQUIRED = (
`#include LED_AMT 30

//#region Globals
void Function(int a, int b, int c) {
    int i = a + b;

    setLed(c, i);
}
//#endregion Globals

void setup(){
    
}

void loop(){
    for(int idx_1=0; idx_1 < 5; idx_1++) {
        Function(2, 4, 7);
        Function(3, 4, 7);
        Function(4, 4, 7);
        Function(2, 1, 7);
        for(int idx=0; idx < 5; idx++) {
            Function(1, 1, 1);
        }
    }
    Function(2, 1, 7);
    Function(2, 1, 7);
    Function(2, 1, 7);
    
}`);

    assertStringsEqual(REQUIRED, result);
};