import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnArgInformation, CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab } from "@cppgen/functionManager/utils/CodeFormatUtil";
import { clamp } from "@utils/MathUtils";
import { ensureNonNaNs } from "@procedure/utils/ProcedurePrepareUtils";

export type FadeProcedureOptions = {

    // Range to play
    idxStart: number,
    idxEnd: number,

    // Color-Range 0-255
    hFrom: number,
    sFrom: number,
    vFrom: number,
    hTo: number,
    sTo: number,
    vTo: number,

    // How many ms each led is before or after the next
    ledOffsetMs: number,

    // How long a rainbow-cycle takes to conclude
    cycleMs: number,

    // How long the animation shall play
    playLength: number,

    // Update rate of the leds
    updateRateMs: number,
}

// TODO: Code improvement idea: Let the generator generate the hsv color before iterating over any leds if the delay per led is set to 0

export function FadeProcPreparer(cfg: FadeProcedureOptions){
    ensureNonNaNs(cfg);

    if(cfg.idxStart < 0)
        cfg.idxStart = 0;
    if(cfg.idxEnd < 0)
        cfg.idxEnd = 0;

    if(cfg.idxStart > cfg.idxEnd){
        const tmp = cfg.idxEnd;
        cfg.idxEnd = cfg.idxStart;
        cfg.idxStart = tmp;
    }
    if(cfg.cycleMs < 1)
        cfg.cycleMs = 1;

    if(cfg.playLength < 0)
        cfg.playLength = 0;
    if(cfg.updateRateMs <= 10)
        cfg.updateRateMs = 10;

    cfg.hFrom = clamp(cfg.hFrom, 0, 255);
    cfg.sFrom = clamp(cfg.sFrom, 0, 255);
    cfg.vFrom = clamp(cfg.vFrom, 0, 255);
    cfg.hTo = clamp(cfg.hTo, 0, 255);
    cfg.sTo = clamp(cfg.sTo, 0, 255);
    cfg.vTo = clamp(cfg.vTo, 0, 255);
}

export class FadeProcLEDNode implements ILEDNode<FadeProcedureOptions> {
    async startNode({ cycleMs, playLength, idxEnd, idxStart, ledOffsetMs, updateRateMs, hFrom, hTo, sFrom, sTo, vFrom, vTo }: FadeProcedureOptions, ctrl: IVisualisationController): Promise<void> {

        // Calculates when to end the simulation
        const end = ctrl.millis()+playLength;

        // Repeats the required amount of times
        while(ctrl.millis() < end){
            // Updates every led      
            for(let led = idxStart; led < idxEnd; led++){
                // Generates the current percentage
                let perc = 2*((ctrl.millis()+ledOffsetMs*led)%cycleMs)/cycleMs;

                // Turns the percentage into a percentage that goes first from 0 to 1 and then slowly back from 1 to 0
                if(perc > 1)
                    perc = 1- (perc-1);

                const linearInterpolation = (from: number, to: number, percentage: number) => perc * (to - from) + from;

                // Work in both directions
                const h = linearInterpolation(hFrom, hTo, perc)
                const s = linearInterpolation(sFrom, sTo, perc);
                const v = linearInterpolation(vFrom, vTo, perc);

                // Updates the color
                ctrl.setLedHSV(led,h,s,v);
            }

            // Sends the update
            ctrl.pushUpdate();

            // Waits
            await ctrl.sleep(updateRateMs);
        }
    }
}

export class FadeProcDiagnostics implements IDiagnostics<FadeProcedureOptions> {

    evaluateRuntime(opts: FadeProcedureOptions): number | undefined {
        return opts.playLength;
    }

    findAllAccessedLeds({ idxEnd, idxStart }: FadeProcedureOptions): Set<number> {
        return new Set(Array(idxEnd - idxStart).fill(0).map((_, idx) => idx + idxStart));
    }
}

export class FadeProcCodeConstructor extends SimpleFunctionCodeConstructor<FadeProcedureOptions> {
    
    getTypeMapping(): { [x in keyof FadeProcedureOptions]: CppType; } {
        return {
            hFrom: CppType.INT,
            sFrom: CppType.INT,
            vFrom: CppType.INT,
            hTo: CppType.INT,
            sTo: CppType.INT,
            vTo: CppType.INT,
            cycleMs: CppType.INT,
            idxEnd: CppType.INT,
            idxStart: CppType.INT,
            ledOffsetMs: CppType.INT,
            playLength: CppType.INT,
            updateRateMs: CppType.INT,
        };
    }
    generateFunctionCode({cycleMs, idxEnd, idxStart, ledOffsetMs, playLength, updateRateMs, hFrom, hTo, sFrom, sTo, vFrom, vTo}: CppFnInformation<FadeProcedureOptions>, gen: ICodeSupport): string {
        
        function getLinearInterpolationEquasion(from: CppFnArgInformation<number>, to: CppFnArgInformation<number>, perc: string) {
            if (from.available && to.available)
                return `${perc} * ${to.value - from.value} + ${from.value}`;

            return `${perc} * (${to} - ${from}) + ${from}`;
        }

        const vEnd = gen.registerVariable("end");
        const vPerc = gen.registerVariable("perc");
        const vLed = gen.registerVariable("led");
        
        return [
            `int ${vEnd} = ${gen.millis()} + ${playLength};`,

            `while(${gen.millis()} < ${vEnd}) {`,
            ...tab([
                `for(int ${vLed} = ${idxStart}; ${vLed} < ${idxEnd}; ${vLed}++) {`,
                ...tab([
                    `float ${vPerc} = 2 * (float)( (${gen.millis()}${
                        ledOffsetMs.available && ledOffsetMs.value === 0 ? `` :
                        ` + ${ledOffsetMs}*${vLed}`
                    }) % ${cycleMs} )/(float)${cycleMs};`,

                    `if(${vPerc} > 1) ${vPerc}=1 - (${vPerc} - 1);`,

                    ...gen.setTabs(gen.setLedHSV(
                        vLed,
                        getLinearInterpolationEquasion(hFrom, hTo, vPerc),
                        getLinearInterpolationEquasion(sFrom, sTo, vPerc),
                        getLinearInterpolationEquasion(vFrom, vTo, vPerc),
                    ), 0).split("\n"),
                ]),
                `}`,
                gen.pushLeds(),
                gen.sleep(updateRateMs)
            ]),
            `}`,
        ].join("\n");
    }
    getDirtyStateAfterExecution(_: FadeProcedureOptions, _1: boolean): boolean {
        return false;
    }
    getFunctionName(): string {
        return "fade";
    }
}
