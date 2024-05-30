import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { VisualizerAbortError } from "./VisualizerAbortError";

export interface IVisualizer {

    /**
     * Starts the visualizer with the provided setup and loop procedures.
     * 
     * @param toVisualize The procedures to run on the visualizer
     * @param abort An AbortSignal that allows aborting the visualization process.
     * 
     * @returns A Promise that resolves when the visualization is complete (Meaning got aborted as the loop will run continuesly)
     */
    startVisualizer(toVisualize: ProcedureWithOptions<any>[]): Promise<void>;

    /**
     * Aborts the current visualization process.
     * 
     * @returns A Promise that resolves when the visualization is aborted.
     */
    abortVisualizer() : Promise<void>;
}