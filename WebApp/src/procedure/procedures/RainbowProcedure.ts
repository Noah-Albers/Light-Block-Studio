import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { CppFnInformation, CppType, ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, ICodeSupport, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { SimpleFunctionCodeConstructor } from "@procedure/implementations/SimpleFunctionCodeConstructor";
import { delayIf, finalPush, tab } from "@cppgen/functionManager/utils/CodeFormatUtil";
import { clamp } from "@utils/MathUtils";
import { ensureNonNaNs } from "@procedure/utils/ProcedurePrepareUtils";

export type RainbowProcedureOptions = {
    // Range to play
    idxStart: number,
    idxEnd: number,

    // How many ms each led is before or after the next
    ledOffsetMs: number,

    // How long a rainbow-cycle takes to conclude
    cycleMs: number,

    // How long the animation shall play
    playLength: number,
    
    // The HSV V-Part (Value) of the rainbow
    v: number,

    // Update rate of the leds
    updateRateMs: number,
}

export function RainbowProcPreparer(cfg: RainbowProcedureOptions){
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
    cfg.v = clamp(cfg.v, 0, 255);
}

export class RainbowProcLEDNode implements ILEDNode<RainbowProcedureOptions> {
    async startNode({ cycleMs, playLength, idxEnd, idxStart, ledOffsetMs, updateRateMs, v }: RainbowProcedureOptions, ctrl: IVisualisationController): Promise<void> {

        // Calculates when to end the simulation
        const end = ctrl.millis()+playLength;

        // Repeats the required amount of times
        while(ctrl.millis() < end){
            // Updates every led      
            for(let led = idxStart; led < idxEnd; led++){
                // Generates the current percentage
                let hue = Math.round(((ctrl.millis()+ledOffsetMs*led)%cycleMs)/cycleMs * 255);
                if(hue < 0)
                    hue+=255;


                // Updates the color
                ctrl.setLedHSV(led,hue,255,v);
            }

            // Sends the update
            ctrl.pushUpdate();

            // Waits
            await ctrl.sleep(updateRateMs);
        }
    }
}

export class RainbowProcDiagnostics implements IDiagnostics<RainbowProcedureOptions> {

    evaluateRuntime(opts: RainbowProcedureOptions): number | undefined {
        return opts.playLength;
    }

    findAllAccessedLeds({ idxEnd, idxStart }: RainbowProcedureOptions): Set<number> {
        return new Set(Array(idxEnd - idxStart).fill(0).map((_, idx) => idx + idxStart));
    }
}

export class RainbowProcCodeConstructor extends SimpleFunctionCodeConstructor<RainbowProcedureOptions> {
    
    getTypeMapping(): { [x in keyof RainbowProcedureOptions]: CppType; } {
        return {
            v: CppType.INT,
            cycleMs: CppType.INT,
            idxEnd: CppType.INT,
            idxStart: CppType.INT,
            ledOffsetMs: CppType.INT,
            playLength: CppType.INT,
            updateRateMs: CppType.INT,
        };
    }
    generateFunctionCode({cycleMs,idxEnd, idxStart, ledOffsetMs, playLength, updateRateMs, v}: CppFnInformation<RainbowProcedureOptions>, gen: ICodeSupport): string {
        
        const vEnd = gen.registerVariable("end");
        const vLed = gen.registerVariable("led");
        const vHue = gen.registerVariable("hue");

        // Note: vHue may very well become negative here. Tho the fastled AND Adafruit Neopixel Librarys are equiped to handle this
        // therefor extra adjustment code wont be added.
        const hueCalc = `int ${vHue} = 255 * (float)( (${gen.millis()}${
            ledOffsetMs.available && ledOffsetMs.value === 0 ? `` :
            ` + ${ledOffsetMs} * ${vLed}`
        }) % ${cycleMs} )/(float)${cycleMs};`

        return [
            `int ${vEnd} = ${gen.millis()} + ${playLength};`,

            `while(${gen.millis()} < ${vEnd}) {`,
            ...tab([
                `for(int ${vLed} = ${idxStart}; ${vLed} < ${idxEnd}; ${vLed}++) {`,
                ...tab([
                    hueCalc,
                    gen.setLedHSV(vLed, vHue, 255, v)
                ]),
                `}`,
                gen.pushLeds(),
                gen.sleep(updateRateMs)
            ]),
            `}`
        ].join("\n");
    }
    getDirtyStateAfterExecution(_: RainbowProcedureOptions, _1: boolean): boolean {
        return false;
    }
    getFunctionName(): string {
        return "rainbow";
    }
}
