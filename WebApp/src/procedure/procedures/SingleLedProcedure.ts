import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";
import { ensureNonNaNs } from "@procedure/utils/ProcedurePrepareUtils";
import { clamp } from "@utils/MathUtils";

export type LEDProcedureOptions = {
    idx: number,

    // HSV in range 0-255
    h: number,
    s: number,
    v: number
}

export function SingleLedProcPrepare(cfg: LEDProcedureOptions){
    ensureNonNaNs(cfg);

    if(cfg.idx < 0)
        cfg.idx = 0;

    cfg.h = clamp(cfg.h, 0, 255);
    cfg.s = clamp(cfg.s, 0, 255);
    cfg.v = clamp(cfg.v, 0, 255);

}

export class SingleLedProcLEDNode implements ILEDNode<LEDProcedureOptions> {
    async startNode({h, idx, s, v}: LEDProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        ctrl.setLedHSV(idx,h,s,v);
    }
}

export class SingleLedProcDiagnostics implements IDiagnostics<LEDProcedureOptions> {

    evaluateRuntime(opts: LEDProcedureOptions): number | undefined {
        return 0;
    }

    findAllAccessedLeds(opts: LEDProcedureOptions): Set<number> {
        return new Set([opts.idx]);
    }
}

export class SingleLedProcCodeConstructor implements ICodeConstructor<LEDProcedureOptions> {

    registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: LEDProcedureOptions[]) {
        return [];
    }

    constructCode({h,idx,s,v}: LEDProcedureOptions, genTools: IExtendedCodeSupport, associatedFunctions: CC_CppFnHandles<{}>, dirtyState: boolean): CodeResult {
        
        const code = genTools.setLedHSV(idx,h,s,v);

        return {
            code: code,
            dirtyState: true
        }
    }
}
