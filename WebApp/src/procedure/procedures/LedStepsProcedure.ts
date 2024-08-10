import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnInformation, CppType } from "@cppgen/functionManager";
import { ICodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab, trinaryEquasion } from "@cppgen/functionManager/utils/CodeFormatUtil";

export type LedStepsProcedureOptions = {
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
    // If the animation shall ran in parallel mode (true) as oppsed to serial mode (false) 
    isParallel: boolean,

    // A delay to set on each led
    ledDelay: number,
    // A delay to set after each step
    stepDelay: number

    // HSV in range 0-255
    h: number,
    s: number,
    v: number
}

export function LedStepsProcPreparer(cfg: LedStepsProcedureOptions) {
    if (cfg.ledDelay < 0)
        cfg.ledDelay = 0;
    if (cfg.stepDelay < 0)
        cfg.stepDelay = 0;
    if (cfg.steps < 0)
        cfg.steps *= -1;
}

export class LedStepsProcLEDNode implements ILEDNode<LedStepsProcedureOptions> {
    async startNode({ isParallel,  h, ledsReversed, stepsReversed, stepSize, stepDelay, stepSpace, steps, idxStart, ledDelay, s, v }: LedStepsProcedureOptions, ctrl: IVisualisationController): Promise<void> {

        // Length of the accessed step
        const maxAccessedStep = (steps - 1) * (stepSize + stepSpace);

        const outerVar = isParallel ? stepSize : steps;
        const innerVar = isParallel ? steps : stepSize;

        for (let a = 0; a < outerVar; a++) {
            for (let b = 0; b < innerVar; b++) {
                let led = isParallel ? a : b;
                let step = isParallel ? b : a;

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

export class LedStepsProcDiagnostics implements IDiagnostics<LedStepsProcedureOptions> {

    evaluateRuntime({ steps, stepDelay, ledDelay, stepSize }: LedStepsProcedureOptions): number | undefined {
        return steps * (stepDelay + ledDelay * stepSize);
    }

    findAllAccessedLeds({ idxStart, steps, stepSize, stepSpace }: LedStepsProcedureOptions): Set<number> {
        const leds = new Set<number>();

        for (let step = 0; step < steps; step++) {
            for (let led = 0; led < stepSize; led++) {

                const stripe = step * (stepSize + stepSpace);

                const idx = idxStart + stripe + led;
                leds.add(idx);
            }
        }

        return leds;
    }
}

export class LedStepsProcCodeConstructor extends SimpleFunctionCodeConstructor<LedStepsProcedureOptions> {

    getTypeMapping(): { [x in keyof LedStepsProcedureOptions]: CppType; } {
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
            stepsReversed: CppType.BOOLEAN,
            isParallel: CppType.BOOLEAN
        };
    }
    generateFunctionCode({ isParallel, h, s, v, idxStart, ledDelay, ledsReversed, stepDelay, stepSize, stepSpace, steps, stepsReversed }: CppFnInformation<LedStepsProcedureOptions>, gen: ICodeSupport): string {

        const vStep = gen.registerVariable("step");
        const vLed = gen.registerVariable("led");
        const vCurrentStep = gen.registerVariable("currentStepIdx");
        const vIdx = gen.registerVariable("idx");

        const needMaxAvailable = !stepsReversed.available || stepsReversed.value;

        const vMaxStep = needMaxAvailable ? gen.registerVariable("maxAccessedStep") : "";

        const stepLoop = ()=>`for(int ${vStep}=0; ${vStep} < ${steps}; ${vStep}++) {`;
        const ledLoop = ()=>`for(int ${vLed}=0; ${vLed} < ${stepSize}; ${vLed}++) {`;

        const modeKnown = isParallel.available;

        const vA = modeKnown ? "" : gen.registerVariable("a");
        const vB = modeKnown ? "" : gen.registerVariable("b");
        const vOuterEnd = modeKnown ? "" : gen.registerVariable("A");
        const vInnerEnd = modeKnown ? "" : gen.registerVariable("B"); 

        const aLoop = ()=>`for(int ${vA}=0; ${vA} < ${vOuterEnd}; ${vA}++) {`;
        const bLoop = ()=>`for(int ${vB}=0; ${vB} < ${vInnerEnd}; ${vB}++) {`;


        const modeInit = modeKnown ? [] : [
            `int ${vOuterEnd} = ${isParallel} ? ${stepSize} : ${steps};`,
            `int ${vInnerEnd} = ${isParallel} ? ${steps} : ${stepSize};`,
        ];

        const outerLoop = (
            modeKnown ?
            (isParallel.value ? ledLoop() : stepLoop()) :
            aLoop()
        );

        const innerLoop = (
            modeKnown ?
            (isParallel.value ? stepLoop() : ledLoop()) :
            bLoop()
        )

        const inLoop = modeKnown ? [] : [
            `int ${vLed} = ${isParallel} ? ${vA} : ${vB};`,
            `int ${vStep} = ${isParallel} ? ${vB} : ${vA};`,
        ]

        return [
            ...(needMaxAvailable ? [
                `int ${vMaxStep} = (${steps} -1) * (${stepSize} + ${stepSpace});`,
            ] : []),
            ...modeInit,
            outerLoop,
            ...tab([
                innerLoop,
                ...tab([
                    ...inLoop,
                    `int ${vCurrentStep} = ${vStep} * (${stepSize} + ${stepSpace});`,
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
            `}`,
            ...finalPush([ledDelay, stepDelay], gen),
        ].join("\n");
    }
    getDirtyStateAfterExecution(_: LedStepsProcedureOptions, previousState: boolean): boolean {
        return false;
    }
    getFunctionName(): string {
        return "SetLEDRangeComplex";
    }
}
