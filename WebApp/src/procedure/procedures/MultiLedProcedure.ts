import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab } from "@cppgen/functionManager/utils/CodeFormatUtil";

export type MultiLedProcedureOptions = {
    // Range to play
    idxStart: number,
    idxEndExclusive: number,

    // A delay to set on each led
    ledDelay: number,

    // HSV in range 0-255
    h: number,
    s: number,
    v: number
}

export function MultiLedProcPreparer(cfg: MultiLedProcedureOptions){
    if(cfg.ledDelay < 0)
        cfg.ledDelay = 0;
}

export class MultiLedProcLEDNode implements ILEDNode<MultiLedProcedureOptions> {
    async startNode({ h, idxEndExclusive: idxEnd, idxStart, ledDelay, s, v }: MultiLedProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        console.log(idxStart, idxEnd)
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

export class MultiLedProcDiagnostics implements IDiagnostics<MultiLedProcedureOptions> {

    evaluateRuntime(opts: MultiLedProcedureOptions): number | undefined {
        return opts.ledDelay * Math.abs(opts.idxEndExclusive - opts.idxStart);
    }

    findAllAccessedLeds({ idxEndExclusive, idxStart }: MultiLedProcedureOptions): Set<number> {
        return new Set(Array(idxEndExclusive - idxStart).fill(0).map((_, idx) => idx + idxStart));
    }
}

export class MultiLedProcCodeConstructor extends SimpleFunctionCodeConstructor<MultiLedProcedureOptions> {
    
    getTypeMapping(): { [x in keyof MultiLedProcedureOptions]: CppType; } {
        return {
            h: CppType.INT,
            s: CppType.INT,
            v: CppType.INT,
            ledDelay: CppType.INT,
            idxStart: CppType.INT,
            idxEndExclusive: CppType.INT,
        };
    }
    generateFunctionCode({h, s, v, idxEndExclusive, idxStart, ledDelay}: CppFnInformation<MultiLedProcedureOptions>, gen: ICodeSupport): string {
        const i = gen.registerVariable("i");

        const compareOperation = idxStart.available && idxEndExclusive.available ? (
            idxStart.value > idxEndExclusive.value ? `>=` : `<`
        ) : "!=";

        const operationKnown = idxStart.available && idxEndExclusive.available;

        const vDir = operationKnown ? "" : gen.registerVariable("dir");

        const initializerCode = operationKnown ? [] : [
            `int8_t ${vDir} = ${idxStart} > ${idxEndExclusive} ? -1 : 1;`,
        ];

        const iterationOperation = idxStart.available && idxEndExclusive.available ? (
            idxStart.value > idxEndExclusive.value ? `${i}--` : `${i}++`
        ) : `${i}+=${vDir}`;

        const endStep = operationKnown ? (
            `${idxEndExclusive.value + (idxStart.value > idxEndExclusive.value ? -1 : 1)}`
        ) : `${idxEndExclusive}+${vDir}`;

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
        ].join("\n");
    }
    getDirtyStateAfterExecution(opts: MultiLedProcedureOptions, previousState: boolean): boolean {
        return opts.ledDelay <= 0;
    }
    getFunctionName(): string {
        return "multiLed";
    }
}
