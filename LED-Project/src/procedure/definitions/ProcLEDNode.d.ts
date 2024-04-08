import { IVisualisationController } from "@visualizer/definitions/Visualizer";
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
     * 
     * The controller exposes various means to signal the end of the visualization (e.g., aborting).
     * If the LED node does not honor these signals, it may be forcefully terminated, which could be treated as an error.
     */
    startNode(options: Options, ctrl: IVisualisationController) : Promise<void>;
}