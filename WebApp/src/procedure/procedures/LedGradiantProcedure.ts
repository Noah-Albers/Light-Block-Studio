import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnArgInformation, CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab, trinaryEquasion } from "@cppgen/functionManager/utils/CodeFormatUtil";
import { MultiLedProcedureOptions } from "./MultiLedProcedure";
import { clamp } from "@utils/MathUtils";
import { ensureNonNaNs } from "@procedure/utils/ProcedurePrepareUtils";

export type LedGradiantProcedureOptions = {
    // Range to play
    idxStart: number,
    idxEnd: number,

    // A delay to set on each led
    ledDelay: number,

    // HSV in range 0-255
    hFrom: number,
    sFrom: number,
    vFrom: number,

    hTo: number,
    sTo: number,
    vTo: number,
}

export function LedGradiantProcPreparer(cfg: LedGradiantProcedureOptions) {
    ensureNonNaNs(cfg);

    if (cfg.ledDelay < 0)
        cfg.ledDelay = 0;

    if(cfg.idxStart < 0)
        cfg.idxStart = 0;
    if(cfg.idxEnd < 0)
        cfg.idxEnd = 0;
    
    cfg.hFrom = clamp(cfg.hFrom, 0, 255);
    cfg.sFrom = clamp(cfg.sFrom, 0, 255);
    cfg.vFrom = clamp(cfg.vFrom, 0, 255);
    cfg.hTo = clamp(cfg.hTo, 0, 255);
    cfg.sTo = clamp(cfg.sTo, 0, 255);
    cfg.vTo = clamp(cfg.vTo, 0, 255);
}

export class LedGradiantProcLEDNode implements ILEDNode<LedGradiantProcedureOptions> {
    async startNode({ sTo, vTo, hTo, hFrom, idxEnd, idxStart, ledDelay, sFrom, vFrom }: LedGradiantProcedureOptions, ctrl: IVisualisationController): Promise<void> {

        const dir = idxStart > idxEnd ? -1 : 1;
        const offset = idxStart > idxEnd ? 1 : 0;

        // Calculates the length
        let len = idxStart - idxEnd;
        if (len <= 0)
            len = -len;

        for (let i = idxStart; i != idxEnd; i += dir) {

            // Percentage
            let perc = i / len;

            const linearInterpolation = (from: number, to: number, percentage: number) => perc * (to - from) + from;

            // Work in both directions
            const h = linearInterpolation(hFrom, hTo, perc)
            const s = linearInterpolation(sFrom, sTo, perc);
            const v = linearInterpolation(vFrom, vTo, perc);

            ctrl.setLedHSV(i - offset, h, s, v);

            if (ledDelay > 0) {
                ctrl.pushUpdate();
                await ctrl.sleep(ledDelay);
            }
        }
    }
}

export class LedGradiantProcDiagnostics implements IDiagnostics<LedGradiantProcedureOptions> {

    evaluateRuntime(opts: LedGradiantProcedureOptions): number | undefined {
        return opts.ledDelay * Math.abs(opts.idxEnd - opts.idxStart);
    }

    findAllAccessedLeds({ idxEnd: idxEnd, idxStart }: LedGradiantProcedureOptions): Set<number> {
        return new Set(Array(idxEnd - idxStart).fill(0).map((_, idx) => idx + idxStart));
    }
}

export class LedGradiantProcCodeConstructor extends SimpleFunctionCodeConstructor<LedGradiantProcedureOptions> {

    getTypeMapping(): { [x in keyof LedGradiantProcedureOptions]: CppType; } {
        return {
            hFrom: CppType.INT,
            sFrom: CppType.INT,
            vFrom: CppType.INT,
            hTo: CppType.INT,
            sTo: CppType.INT,
            vTo: CppType.INT,
            ledDelay: CppType.INT,
            idxStart: CppType.INT,
            idxEnd: CppType.INT,
        };
    }

    generateFunctionCode({ idxEnd, idxStart, hFrom, hTo, sTo, sFrom, vFrom, vTo, ledDelay }: CppFnInformation<LedGradiantProcedureOptions>, gen: ICodeSupport): string {

        function getLinearInterpolationEquasion(from: CppFnArgInformation<number>, to: CppFnArgInformation<number>, perc: string) {
            if (from.available && to.available)
                return `${perc} * ${to.value - from.value} + ${from.value}`;

            return `${perc} * (${to} - ${from}) + ${from}`;
        }

        const knowsDirection = idxEnd.available && idxStart.available;

        const vDir = knowsDirection ? "" : gen.registerVariable("dir");
        const vOffset = knowsDirection ? "" : gen.registerVariable("offset");

        const vLength = gen.registerVariable("length");
        const vI = gen.registerVariable("i");

        const vPerc = gen.registerVariable("perc");

        return [
            ...(knowsDirection ? [] : [
                `int ${vDir} = ${idxStart} > ${idxEnd} ? -1 : 1;`,
                `int ${vOffset} = ${idxStart} > ${idxEnd} ? 1 : 0;`
            ]),
            `int ${vLength} = ${idxStart} - ${idxEnd};`,
            `if(${vLength} < 0) ${vLength} = -${vLength};`,

            (knowsDirection ?
                idxStart.value < idxEnd.value ?
                    `for (int ${vI} = ${idxStart}; ${vI} < ${idxEnd}; ${vI}++) {` :
                    `for (int ${vI} = ${idxStart}; ${vI} >= ${idxEnd}; ${vI}--) {` :
                `for (int ${vI} = ${idxStart}; ${vI} != ${idxEnd}; ${vI}+=${vDir}) {`
            ),
            ...tab([
                `float ${vPerc} = (float)${vI}/(float)${vLength};`,
                ...gen.setTabs(gen.setLedHSV(
                    knowsDirection ? vI : `${vI}-${vOffset}`,
                    getLinearInterpolationEquasion(hFrom, hTo, vPerc),
                    getLinearInterpolationEquasion(sFrom, sTo, vPerc),
                    getLinearInterpolationEquasion(vFrom, vTo, vPerc),
                ), 0).split("\n"),
                ...delayIf(ledDelay, gen),
            ]),
            "}"

        ].join("\n");
    }

    getDirtyStateAfterExecution(options: LedGradiantProcedureOptions, previousState: boolean): boolean {
        return options.ledDelay <= 0;
    }

    getFunctionName(): string {
        return "ledGradiant";
    }
}
