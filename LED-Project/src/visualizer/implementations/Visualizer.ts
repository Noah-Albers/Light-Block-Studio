import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { IVisualizer } from "@visualizer/definitions/Visualizer";
import { LEDPushCallback, VisualisationController } from "./VisualisationController";
import { VisualizerAbortError } from "@visualizer/definitions/VisualizerAbortError";

export class Visualizer implements IVisualizer {
    
    private abortController: AbortController = new AbortController();
    private onPushLeds: LEDPushCallback;

    // A cache that caches the last running promise
    private runCache: Promise<void> | undefined;

    /**
     * Constructs a new Visualizer.
     * 
     * @param onPushLeds The callback function to push LED updates.
     */
    constructor(onPushLeds: LEDPushCallback){
        this.onPushLeds = onPushLeds;
    }

    /**
     * Internal method to start the visualizer with the provided setup and loop procedures.
     * 
     * @param setup The setup procedures to initialize the visualizer and play any one-time visualizations.
     * @param loop The loop procedures to continuously update the visualizer.
     * @param abort The AbortSignal used for aborting the visualization process.
     */
    private async internal_startVisualizer(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], abort: AbortSignal) {
        try {
            const signal = this.abortController.signal;

            // Creates the controller which the LEDNodes can accss
            const controller = new VisualisationController(signal, this.onPushLeds);
            
            // Runs the start controllers for setup
            for(let proc of setup){
                await proc.procedure.getLEDNode().startNode(proc.options, controller);

                if(signal.aborted) return;
            }

            // Loops through loop procedures until aborted
            while(true) {
                const startTime = Date.now();

                for(let proc of loop){
                    await proc.procedure.getLEDNode().startNode(proc.options, controller);
    
                    if(signal.aborted) return;
                }

                // Inserts a small delay if the runtime was below 500 ms
                const runTime = Date.now() - startTime;
                if(runTime < 500)
                    await controller.sleep(500);
            }
        }catch(err){

            // Filters for the abort signal
            if(err instanceof VisualizerAbortError)
                return;

            // TODO: Implement better error handling
            console.warn("Error cought inside the visualizer: ", err);
        } finally {
            this.runCache = undefined;
        }
    }

    async startVisualizer(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], abort: AbortSignal): Promise<void> {
        
        if(this.runCache !== undefined)
            await this.abortVisualizer();
        
        // Starts the new visualizer
        this.runCache = this.internal_startVisualizer(setup, loop, abort);

        await this.runCache;
    }

    abortVisualizer(): Promise<void> {
        if(this.runCache === undefined)
            return Promise.resolve();

        this.abortController.abort();

        return this.runCache;
    }
}