import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnArgInformation, CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, tab, trinaryEquasion } from "@cppgen/functionManager/utils/CodeFormatUtil";

export type LEDRangeSeriesProcedureOptions = {
    // Range to play
    idxStart: number,

    // Amount of steps
    steps: number

    // Space between steps
    stepSpace: number,

    // Amount of leds per step
    stepSize: number,

    // If the animation shall play in reverse
    stepsReversed: boolean,
    ledsReversed: boolean,

    // A delay to set on each led
    ledDelay: number,
    // A delay to set after each step
    stepDelay: number

    // HSV in range 0-255
    h: number,
    s: number,
    v: number
}

export function SetLedRangeSeriesProcPreparer(cfg: LEDRangeSeriesProcedureOptions) {
    if (cfg.ledDelay < 0)
        cfg.ledDelay = 0;
    if (cfg.stepDelay < 0)
        cfg.stepDelay = 0;
    if (cfg.steps < 0)
        cfg.steps *= -1;
}

export class SetLedRangeSeriesProcLEDNode implements ILEDNode<LEDRangeSeriesProcedureOptions> {
    async startNode({ h, ledsReversed, stepsReversed, stepSize, stepDelay, stepSpace, steps, idxStart, ledDelay, s, v }: LEDRangeSeriesProcedureOptions, ctrl: IVisualisationController): Promise<void> {

        // Length of the accessed step
        const maxAccessedStep = (steps - 1) * (stepSize + stepSpace);

        for (let step = 0; step < steps; step++) {
            for (let led = 0; led < stepSize; led++) {
                const stripe = step * (stepSize + stepSpace);

                const idx = idxStart + (
                    stepsReversed ? (maxAccessedStep - stripe) : stripe
                ) + (
                        ledsReversed ? (stepSize - led - 1) : led
                    );

                ctrl.setLedHSV(idx, h, s, v);

                if (ledDelay > 0) {
                    ctrl.pushUpdate();
                    await ctrl.sleep(ledDelay);
                }
            }
            if (stepDelay > 0) {
                ctrl.pushUpdate();
                await ctrl.sleep(ledDelay);
            }
        }
    }
}

export class SetLedRangeSeriesProcDiagnostics implements IDiagnostics<LEDRangeSeriesProcedureOptions> {

    evaluateRuntime({ steps, stepDelay, ledDelay, stepSize }: LEDRangeSeriesProcedureOptions): number | undefined {
        return steps * (stepDelay + ledDelay * stepSize);
    }

    findAllAccessedLeds({ idxStart, steps, stepSize, stepSpace }: LEDRangeSeriesProcedureOptions): Set<number> {
        // Length of the step
        const length = (steps - 1) * (stepSize + stepSpace);

        return new Set(Array(length).fill(0).map((_,idx)=>idx+idxStart));
    }
}

export class SetLedRangeSeriesProcCodeConstructor extends SimpleFunctionCodeConstructor<LEDRangeSeriesProcedureOptions> {

    getTypeMapping(): { [x in keyof LEDRangeSeriesProcedureOptions]: CppType; } {
        return {
            h: CppType.INT,
            s: CppType.INT,
            v: CppType.INT,
            idxStart: CppType.INT,
            ledDelay: CppType.INT,
            ledsReversed: CppType.BOOLEAN,
            stepDelay: CppType.INT,
            steps: CppType.INT,
            stepSize: CppType.INT,
            stepSpace: CppType.INT,
            stepsReversed: CppType.BOOLEAN
        };
    }
    generateFunctionCode({ h, s, v, idxStart, ledDelay, ledsReversed, stepDelay, stepSize, stepSpace, steps, stepsReversed }: CppFnInformation<LEDRangeSeriesProcedureOptions>, gen: ICodeSupport): string {

        const vStep = gen.registerVariable("step");
        const vLed = gen.registerVariable("led");
        const vCurrentStep = gen.registerVariable("currentStepIdx");
        const vIdx = gen.registerVariable("idx");

        const knowStepReversed = stepsReversed.available && stepsReversed.value;
        
        const vMaxStep = knowStepReversed ? gen.registerVariable("maxAccessedStep") : "";


        return [
            ...(knowStepReversed ? [
                `int ${vMaxStep} = (${steps} -1) * (${stepSize} + ${stepSpace})`,
            ] : []),
            `for(int ${vStep}=0; ${vStep} < ${steps}; ${vStep}++) {`,
            ...tab([
                `for(int ${vLed}=0; ${vLed} < ${stepSize}; ${vLed}++) {`,
                ...tab([
                    `int ${vIdx} = ${idxStart} + (`,
                    tab(trinaryEquasion(
                        stepsReversed,
                        `(${vMaxStep} - ${vCurrentStep})`,
                        vCurrentStep
                    )),
                    ") + (",
                    tab(trinaryEquasion(
                        ledsReversed,
                        `(${stepSize} - ${vLed} -1)`,
                        vLed
                    )),
                    ");",
                    gen.setLedHSV(vIdx,h,s,v),
                    ...delayIf(ledDelay, gen),
                ]),
                `}`,
                ...delayIf(stepDelay, gen, ledDelay.available && ledDelay.value > 0),
            ]),
            `}`
        ].join("\n");
    }
    getDirtyStateAfterExecution({ ledDelay, stepDelay }: LEDRangeSeriesProcedureOptions, previousState: boolean): boolean {
        return ledDelay !== 0 && stepDelay !== 0;
    }
    getFunctionName(): string {
        return "setLEDRangeSeries";
    }
}
