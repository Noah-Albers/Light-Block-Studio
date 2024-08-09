import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab } from "@cppgen/functionManager/utils/CodeFormatUtil";

export type LEDRangeProcedureOptions = {
    // Range to play
    idxStart: number,
    idxEnd: number,

    // A delay to set on each led
    ledDelay: number,

    // HSV in range 0-255
    h: number,
    s: number,
    v: number
}

export function SetLedRangeSimpleProcPreparer(cfg: LEDRangeProcedureOptions){
    if(cfg.ledDelay < 0)
        cfg.ledDelay = 0;
}

export class SetLedRangeSimpleProcLEDNode implements ILEDNode<LEDRangeProcedureOptions> {
    async startNode({ h, idxEnd, idxStart, ledDelay, s, v }: LEDRangeProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        
        const dir = idxStart > idxEnd ? -1 : 1;

        for (let i = idxStart; i != idxEnd+dir; i+=dir) {
            ctrl.setLedHSV(i, h, s, v);
            if(ledDelay > 0){
                ctrl.pushUpdate();
                await ctrl.sleep(ledDelay);
            }
        }
    }
}

export class SetLedRangeSimpleProcDiagnostics implements IDiagnostics<LEDRangeProcedureOptions> {

    evaluateRuntime(opts: LEDRangeProcedureOptions): number | undefined {
        return opts.ledDelay * Math.abs(opts.idxEnd - opts.idxStart);
    }

    findAllAccessedLeds({ idxEnd, idxStart }: LEDRangeProcedureOptions): Set<number> {
        return new Set(Array(idxEnd - idxStart).fill(0).map((_, idx) => idx + idxStart));
    }
}

export class SetLedRangeSimpleProcCodeConstructor extends SimpleFunctionCodeConstructor<LEDRangeProcedureOptions> {
    
    getTypeMapping(): { [x in keyof LEDRangeProcedureOptions]: CppType; } {
        return {
            h: CppType.INT,
            s: CppType.INT,
            v: CppType.INT,
            ledDelay: CppType.INT,
            idxStart: CppType.INT,
            idxEnd: CppType.INT,
        };
    }
    generateFunctionCode({h, s, v, idxEnd, idxStart, ledDelay}: CppFnInformation<LEDRangeProcedureOptions>, gen: ICodeSupport): string {
        const i = gen.registerVariable("i");

        const compareOperation = idxStart.available && idxEnd.available ? (
            idxStart.value > idxEnd.value ? `>=` : `<`
        ) : "!=";

        const operationKnown = idxStart.available && idxEnd.available;

        const vDir = operationKnown ? "" : gen.registerVariable("dir");

        const initializerCode = operationKnown ? [] : [
            `int8_t ${vDir} = ${idxStart} > ${idxEnd} ? -1 : 1;`,
        ];

        const iterationOperation = idxStart.available && idxEnd.available ? (
            idxStart.value > idxEnd.value ? `${i}--` : `${i}++`
        ) : `${i}+=${vDir}`;

        const endStep = operationKnown ? (
            `${idxEnd.value + (idxStart.value > idxEnd.value ? -1 : 1)}`
        ) : `${idxEnd}+${vDir}`;

        return [
            ...initializerCode,
            `for(int ${i}=${idxStart}; ${i} ${compareOperation} ${endStep}; ${iterationOperation}){`,
            ...tab([
                `${gen.setLedHSV(
                    i ,h,s,v)
                }`,
                ...delayIf(ledDelay,gen)
            ]),
            "}",
            finalPush([ledDelay], gen),
        ].join("\n");
    }
    getDirtyStateAfterExecution({ledDelay}: LEDRangeProcedureOptions, previousState: boolean): boolean {
        return ledDelay <= 0;
    }
    getFunctionName(): string {
        return "setLEDRangeSimple";
    }
}
