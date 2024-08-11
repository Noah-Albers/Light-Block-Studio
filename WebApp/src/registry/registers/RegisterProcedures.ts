
import { SimpleProcedure } from "@procedure/implementations/SimpleProcedure"
import { DelayProcCodeConstructor, DelayProcDiagnostics, DelayProcLEDNode, DelayProcPreparer } from "@procedure/procedures/DelayProcedure"
import { FadeProcCodeConstructor, FadeProcDiagnostics, FadeProcLEDNode, FadeProcPreparer } from "@procedure/procedures/FadeProcedure"
import { LedGradiantProcCodeConstructor, LedGradiantProcDiagnostics, LedGradiantProcLEDNode, LedGradiantProcPreparer } from "@procedure/procedures/LedGradiantProcedure"
import { LedStepsProcCodeConstructor, LedStepsProcDiagnostics, LedStepsProcLEDNode, LedStepsProcPreparer } from "@procedure/procedures/LedStepsProcedure"
import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure"
import { MultiLedProcCodeConstructor, MultiLedProcDiagnostics, MultiLedProcLEDNode, MultiLedProcPreparer } from "@procedure/procedures/MultiLedProcedure"
import { PlaceholderProcedure } from "@procedure/procedures/PlaceholderProcedure"
import { RainbowProcCodeConstructor, RainbowProcDiagnostics, RainbowProcLEDNode, RainbowProcPreparer } from "@procedure/procedures/RainbowProcedure"
import { SingleLedProcCodeConstructor, SingleLedProcDiagnostics, SingleLedProcLEDNode } from "@procedure/procedures/SingleLedProcedure"

// Used to register all procedures
export function registerProcedures() {
    return {
        loop: new LoopProcedure(),
        delay: new SimpleProcedure("delay", new DelayProcCodeConstructor(), new DelayProcDiagnostics(), new DelayProcLEDNode(), { delay: 100 }, DelayProcPreparer),
        singleLed: new SimpleProcedure("single_led", new SingleLedProcCodeConstructor(), new SingleLedProcDiagnostics(), new SingleLedProcLEDNode(), { idx: 0, h: 255, s: 255, v: 255}),
        multiLed: new SimpleProcedure("multi_led", new MultiLedProcCodeConstructor(), new MultiLedProcDiagnostics(), new MultiLedProcLEDNode(), { h: 255, s: 255, v: 255, idxEndExclusive: 16, idxStart: 0,ledDelay: 100 }, MultiLedProcPreparer),
        ledSteps: new SimpleProcedure("led_steps", new LedStepsProcCodeConstructor(), new LedStepsProcDiagnostics(), new LedStepsProcLEDNode(), { h: 255, s: 255, v: 255, idxStart: 1, ledDelay: 100, stepDelay: 500, ledsReversed: false, stepsReversed: false, steps: 5, stepSize: 3, stepSpace: 2, isParallel: false }, LedStepsProcPreparer),
        placeholder: new PlaceholderProcedure(),
        ledGradiant: new SimpleProcedure("ledGradiant", new LedGradiantProcCodeConstructor(), new LedGradiantProcDiagnostics(), new LedGradiantProcLEDNode(), { hFrom: 255, sFrom: 255, vFrom: 255, hTo: 128, sTo: 128, vTo: 128, idxEnd: 16, idxStart: 0,ledDelay: 100 }, LedGradiantProcPreparer),
        rainbow: new SimpleProcedure("rainbow", new RainbowProcCodeConstructor(), new RainbowProcDiagnostics(), new RainbowProcLEDNode(), { cycleMs: 1000, idxEnd: 5, idxStart: 0, ledOffsetMs: 20, updateRateMs: 50, playLength: 3000, v: 255 }, RainbowProcPreparer),
        fade: new SimpleProcedure("fade", new FadeProcCodeConstructor(), new FadeProcDiagnostics(), new FadeProcLEDNode(), { cycleMs: 1000, idxEnd: 5, idxStart: 0, ledOffsetMs: 20, updateRateMs: 50, playLength: 3000, hFrom: 255, sFrom: 255, vFrom: 255, hTo: 128, sTo: 128, vTo: 128 }, FadeProcPreparer),

    } as const
}