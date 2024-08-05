import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { LoopProcedureOptions } from "./LoopProcedure";

export class LoopProcDiagnostics implements IDiagnostics<LoopProcedureOptions> {

    evaluateRuntime(opts: LoopProcedureOptions): number | undefined {

        if(opts.repeats < 0) return Infinity;

        // Evaluates the runtime of all submodules
        let result = opts.sub.map(proc=>proc.procedure.getDiagnostics().evaluateRuntime(proc.options));

        // Checks if runtime is undefined
        if(result.some(runtime=>runtime === undefined)) return undefined;

        return (result as number[]).reduce((a,b)=>a+b, 0) * opts.repeats;
    }

    findAllAccessedLeds(opts: LoopProcedureOptions): Set<number> {
        // Gets the accessed leds of all submodules
        let allLeds = opts.sub.map(proc=>proc.procedure.getDiagnostics().findAllAccessedLeds(proc.options));
        
        // Combines them all into one single set
        return new Set(allLeds.flatMap(set => Array.from(set)));
    }
}