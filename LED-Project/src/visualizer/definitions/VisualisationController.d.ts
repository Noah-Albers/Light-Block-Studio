import { VisualizerAbortError } from "./VisualizerAbortError";

/**
* Represents a controller for visualizing procedures with LED nodes.
*/
export interface IVisualisationController {

    /**
     * Pauses execution for a specified number of milliseconds.
     * 
     * @param ms The duration to pause execution, in milliseconds.
     * 
     * @throws {VisualizerAbortError}
     * 
     * @example
     * // Sleep for 10 seconds
     * await sleep(10 * 1000);
     */
    sleep(ms: number): Promise<void>;

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
     * @param r the red value of the led (0-255)
     * @param g the green value of the led (0-255)
     * @param b the blue value of the led (0-255)
     * 
     * @example
     * // Set LED 1 (index 0) to red
     * setLed(0, 0xff, 0, 0);
     */
    setLed(idx: number, r: number, g: number, b: number): void;
}
