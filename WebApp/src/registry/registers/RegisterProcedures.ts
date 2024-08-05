
import { SimpleProcedure } from "@procedure/implementations/SimpleProcedure"
import { DelayProcCodeConstructor, DelayProcDiagnostics, DelayProcLEDNode } from "@procedure/procedures/DelayProcedure"
import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure"
import { SetLedSimpleProcCodeConstructor, SetLedSimpleProcDiagnostics, SetLedSimpleProcLEDNode } from "@procedure/procedures/SetLedSimpleProcedure"

// Used to register all procedures
export function registerProcedures() {
    return {
        loop: new LoopProcedure(),
        delay: new SimpleProcedure("delay", new DelayProcCodeConstructor(), new DelayProcDiagnostics(), new DelayProcLEDNode(), { delay: 100 }),
        setLedSimple: new SimpleProcedure("setled_simple", new SetLedSimpleProcCodeConstructor(), new SetLedSimpleProcDiagnostics(), new SetLedSimpleProcLEDNode(), { idx: 0, h: 1, s: 1, v: 1})
    }
}