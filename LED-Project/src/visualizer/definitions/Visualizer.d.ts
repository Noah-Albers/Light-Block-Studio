import { ProcedureWithOptions } from "@procedure/definitions/Procedure";

/**
* Represents a controller for visualizing procedures with LED nodes.
*/
export interface IVisualisationController {

    /**
     * Pauses execution for a specified number of milliseconds.
     * 
     * @param ms The duration to pause execution, in milliseconds.
     * 
     * @example
     * // Sleep for 10 seconds
     * await sleep(10 * 1000);
     */
    sleep(ms: number): Promise<void>;

    /**
      * Checks if the procedure has been aborted.
      * 
      * @returns {boolean} A boolean value indicating whether the procedure has been aborted.
      */
    hasAborted(): boolean;

    /**
     * Pushes the updated LED states to the LED stripe.
     */
    pushUpdate(): void;

    /**
     * Returns the number of milliseconds elapsed since the microcontroller started.
     * 
     * @returns The number of milliseconds elapsed.
     */
    millis(): number;

    /**
     * Sets the color of an LED at the specified index.
     * 
     * @param idx The index of the LED.
     * @param rgb The RGB color value of the LED.
     * 
     * @example
     * // Set LED 1 (index 0) to red
     * setLed(0, 0xff0000);
     */
    setLed(idx: number, rgb: number): void;

    /**
     * Registers a callback function to be executed when the visualisation is aborted.
     * 
     * @param callback The callback function to be executed.
     * @param args Additional arguments to be passed to the callback function.
     */
    onAbort<Args extends any[]>(callback: (...args: Args) => any, ...args: Args): void;
}

export interface Visualizer {

    /**
     * Starts the visualizer with the provided setup and loop procedures.
     * 
     * @param setup The setup procedure to initialize the visualizer and play any one-time visualisations.
     * @param loop The loop procedure to continuously update the visualizer.
     * @param abort An AbortSignal that allows aborting the visualization process.
     * 
     * @returns A Promise that resolves when the visualization is complete or rejects if it's aborted.
     */
    startVisualizer(setup: ProcedureWithOptions<any>, loop: ProcedureWithOptions<any>, abort: AbortSignal): Promise<void>;

    /**
     * Aborts the current visualization process.
     * 
     * @returns A Promise that resolves when the visualization is aborted.
     */
    abortVisualizer() : Promise<void>;
}