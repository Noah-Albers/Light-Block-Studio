import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { LedStepsProcedureOptions } from "@procedure/procedures/LedStepsProcedure";
import { Registry } from "@registry/Registry";

export function selectBestColorProcedure(cfg: LedStepsProcedureOptions) : ProcedureWithOptions<any> {

    // Diagnostics
    const diagnostics = Registry.procedures.setLedRangeComplex.getDiagnostics();

    const accessedLeds = [...diagnostics.findAllAccessedLeds(cfg)]

    // Checks if no led is set
    if(accessedLeds.length <= 0)
        return {
            procedure: Registry.procedures.placeholder,
            options: { sub: [] }
        }

    const { h, s, v } = cfg;

    // Checks if only one led is set
    if(accessedLeds.length === 1){

        const setLedProc = {
            procedure: Registry.procedures.setLedSimple,
            options: { idx: accessedLeds[0], h, s, v }
        };

        // Checks for delays
        if(cfg.ledDelay > 0 || cfg.stepDelay > 0)
            return {
                procedure: Registry.procedures.placeholder,
                options: {sub: [
                    setLedProc,
                    { procedure: Registry.procedures.delay, options: { delay: cfg.ledDelay + cfg.stepDelay }}
                ]}
            }

        return setLedProc;
    }

    const isAllReversed = cfg.ledsReversed && cfg.stepsReversed;
    const isNoneReversed = !cfg.ledsReversed && !cfg.stepsReversed;

    // If in series, no space between steps, the step delay is not set
    // and either all is reversed or none is reversed
    const canBeSeries = (
        !cfg.isParallel && cfg.stepSpace <= 0 && cfg.stepDelay <= 0 &&
        (isAllReversed || isNoneReversed)
    )

    if(canBeSeries){
        // Get smallest and biggest idx
        const minIdx = accessedLeds.reduce((a,b)=>a<b ? a : b);
        const maxIdx = accessedLeds.reduce((a,b)=>a>b ? a : b);

        // Can be a simple led range
        return {
            procedure: Registry.procedures.setLedRangeSimple,
            options: { h, s, v,
                idxStart: isNoneReversed ? minIdx : maxIdx,
                idxEndExclusive: isNoneReversed ? maxIdx : minIdx,
                ledDelay: cfg.ledDelay
            }
        }
    }

    // Otherwise it must be a complex led set procedure
    return {
        procedure: Registry.procedures.setLedRangeComplex,
        options: cfg
    }
}