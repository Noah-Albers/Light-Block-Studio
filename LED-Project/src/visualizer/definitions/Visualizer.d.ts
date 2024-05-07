import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { VisualizerAbortError } from "./VisualizerAbortError";

export interface IVisualizer {

    /**
     * Starts the visualizer with the provided setup and loop procedures.
     * 
     * @param setup The setup procedures to initialize the visualizer and play any one-time visualisations.
     * @param loop The loop procedures to continuously update the visualizer.
     * @param abort An AbortSignal that allows aborting the visualization process.
     * 
     * @returns A Promise that resolves when the visualization is complete (Meaning got aborted as the loop will run continuesly)
     */
    startVisualizer(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], abort: AbortSignal): Promise<void>;

    /**
     * Aborts the current visualization process.
     * 
     * @returns A Promise that resolves when the visualization is aborted.
     */
    abortVisualizer() : Promise<void>;
}