import { IVisualisationController } from "@visualizer/definitions/VisualisationController";
import { ProcedureOptions } from "./Procedure";

export interface ILEDNode<Options extends ProcedureOptions>{

    /**
     * @async
     * 
     * Starts the LED node visualization of this procedure.
     * 
     * It uses the following parameters:
     * @param options The options of the procedure.
     * @param ctrl A controller used to interact with the LED stripe.
     * 
     * @returns A Promise that resolves when the animation is complete.
     */
    startNode(options: Options, ctrl: IVisualisationController) : Promise<void>;
}