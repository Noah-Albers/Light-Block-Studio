import { ProcedureOptions } from "./Procedure";

export interface IVisualisationController {

    /**
     * Stops execution for
     * @param ms this amount of milliseconds
     * 
     * @example
     * 
     * // Sleep for 10 seconds
     * await sleep(10 * 1000);
     */
    sleep(ms: number) : Promise<void>;

    /**
     * Returns if the procedure has ended
     */
    hasEnded() : boolean;

    /**
     * Pushes the updated leds to the led-stripe
     */
    pushUpdate() : void;

    /**
     * @returns How many milliseconds have ellapsed since the micorcontroller has started.
     */
    millis() : number;

    /**
     * Sets the led at
     * @param idx this index to
     * @param rgb this RGB-value
     * 
     * @example
     * 
     * // Set led 1 (Index 0) to Red
     * setLed(0, 0xff0000);
     */
    setLed(idx: number, rgb: number) : void;

    /**
     * Adds a
     * @param callback callback function which is called once when the visualisation shall end (Is aborted) 
     * @param args these args are just passed as is to the callback function.
     *             Useful if you want to pass some args of your own.
     */
    onEnd<Args extends any[]>(callback: (...args: Args)=>any, ...args: Args) : void;
}

export interface IVisualizer<Options extends ProcedureOptions>{

    /**
     * @async
     * 
     * Starts the visualisation of this procedure.
     * 
     * It uses
     * @param options the options of the procedure and 
     * @param ctrl a visualisation-controller which is used to interact with the led-stripe
     * 
     * @returns a Promise in which the animation is run.
     * 
     * The VisualisationController exposes various means to signal that a visualisation shall end (Be aborted).
     * If the Visualizer doesn't honer that, it may be killed forcefully and this behavious may be treated as an error.
     */
    startVisualisation(options: Options, ctrl: IVisualisationController) : Promise<void>;
}