import { IDiagnostics } from "@procedure/definitions/ProcDiagnostics";
import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { ICppFnManager } from "@cppgen/functionManager";
import { CodeResult, IExtendedCodeSupport } from "@cppgen/generator";
import { IVisualisationController } from "@visualizer/index";
import { CC_CppFnHandles, ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";

export type LEDProcedureOptions = {
    idx: number,

    // HSV in range 0-1
    h: number,
    s: number,
    v: number
}

export class SetLedSimpleProcLEDNode implements ILEDNode<LEDProcedureOptions> {
    async startNode({h, idx, s, v}: LEDProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        ctrl.setLedHSV(idx,h,s,v);
    }
}

export class SetLedSimpleProcDiagnostics implements IDiagnostics<LEDProcedureOptions> {

    evaluateRuntime(opts: LEDProcedureOptions): number | undefined {
        return 0;
    }

    findAllAccessedLeds(opts: LEDProcedureOptions): Set<number> {
        return new Set([opts.idx]);
    }
}

export class SetLedSimpleProcCodeConstructor implements ICodeConstructor<LEDProcedureOptions> {

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
