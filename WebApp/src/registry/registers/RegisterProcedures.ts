
import { SimpleProcedure } from "@procedure/implementations/SimpleProcedure"
import { DelayProcCodeConstructor, DelayProcDiagnostics, DelayProcLEDNode } from "@procedure/procedures/DelayProcedure"
import { LedGradiantProcCodeConstructor, LedGradiantProcDiagnostics, LedGradiantProcLEDNode, LedGradiantProcPreparer } from "@procedure/procedures/LedGradiantProcedure"
import { LedStepsProcCodeConstructor, LedStepsProcDiagnostics, LedStepsProcLEDNode, LedStepsProcPreparer } from "@procedure/procedures/LedStepsProcedure"
import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure"
import { MultiLedProcCodeConstructor, MultiLedProcDiagnostics, MultiLedProcLEDNode, MultiLedProcPreparer } from "@procedure/procedures/MultiLedProcedure"
import { PlaceholderProcedure } from "@procedure/procedures/PlaceholderProcedure"
import { SingleLedProcCodeConstructor, SingleLedProcDiagnostics, SingleLedProcLEDNode } from "@procedure/procedures/SingleLedProcedure"

// Used to register all procedures
export function registerProcedures() {
    return {
        loop: new LoopProcedure(),
        delay: new SimpleProcedure("delay", new DelayProcCodeConstructor(), new DelayProcDiagnostics(), new DelayProcLEDNode(), { delay: 100 }),
        singleLed: new SimpleProcedure("single_led", new SingleLedProcCodeConstructor(), new SingleLedProcDiagnostics(), new SingleLedProcLEDNode(), { idx: 0, h: 1, s: 1, v: 1}),
        multiLed: new SimpleProcedure("multi_led", new MultiLedProcCodeConstructor(), new MultiLedProcDiagnostics(), new MultiLedProcLEDNode(), { h: 1, s: 1, v: 1, idxEndExclusive: 16, idxStart: 0,ledDelay: 100 }, MultiLedProcPreparer),
        ledSteps: new SimpleProcedure("led_steps", new LedStepsProcCodeConstructor(), new LedStepsProcDiagnostics(), new LedStepsProcLEDNode(), { h: 1, s: 1, v: 1, idxStart: 1, ledDelay: 100, stepDelay: 500, ledsReversed: false, stepsReversed: false, steps: 5, stepSize: 3, stepSpace: 2, isParallel: false }, LedStepsProcPreparer),
        placeholder: new PlaceholderProcedure(),
        ledGradiant: new SimpleProcedure("ledGradiant", new LedGradiantProcCodeConstructor(), new LedGradiantProcDiagnostics(), new LedGradiantProcLEDNode(), { hFrom: 1, sFrom: 1, vFrom: 1, hTo: .5, sTo: .5, vTo: .5, idxEnd: 16, idxStart: 0,ledDelay: 100 }, LedGradiantProcPreparer)
    } as const
}