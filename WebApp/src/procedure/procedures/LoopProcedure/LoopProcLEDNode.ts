import { ILEDNode } from "@procedure/definitions/ProcLEDNode";
import { LoopProcedureOptions } from "./LoopProcedure";
import { IVisualisationController } from "@visualizer/definitions/VisualisationController";


export class LoopProcLEDNode implements ILEDNode<LoopProcedureOptions> {

    async startNode(options: LoopProcedureOptions, ctrl: IVisualisationController): Promise<void> {
        const repeats = options.repeats < 0 ? Infinity : options.repeats;
        
        for(let i=0; i < repeats; i++){
            const startTime = Date.now();

            // Runs the sub-procedures
            for(let proc of options.sub)
                await proc.procedure.getLEDNode().startNode(proc.options, ctrl);

            // Inserts a small delay if the runtime was below 500 ms
            const runTime = Date.now() - startTime;
            if(runTime < 500 && repeats === Infinity){
                ctrl.pushUpdate();
                await ctrl.sleep(500);
            }
        }
    }

}