
import { LoopProcedure } from "@procedure/procedures/LoopProcedure/LoopProcedure"

// Used to register all procedures
export function registerProcedures() {
    return {
        loop: new LoopProcedure()
    }
}