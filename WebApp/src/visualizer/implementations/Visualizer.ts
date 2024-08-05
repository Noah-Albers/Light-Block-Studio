import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { IVisualizer } from "@visualizer/definitions/Visualizer";
import { LEDPushCallback, VisualisationController } from "./VisualisationController";
import { VisualizerAbortError } from "@visualizer/definitions/VisualizerAbortError";

export class Visualizer implements IVisualizer {
    
    private abortController!: AbortController;
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

    private async internal_startVisualizer(toVisualize: ProcedureWithOptions<any>[]) {
        this.abortController = new AbortController();

        try {
            const signal = this.abortController.signal;

            // Creates the controller which the LEDNodes can accss
            const controller = new VisualisationController(signal, this.onPushLeds);

            // Runs the visualisation
            for(let proc of toVisualize){
                await proc.procedure.getLEDNode().startNode(proc.options, controller);
                if(signal.aborted)
                    return;
            }

            controller.pushUpdate();
        }catch(err){

            // Filters for the abort signal
            if(err instanceof VisualizerAbortError)
                return;

            console.warn("Error cought inside the visualizer: ", err);
        } finally {
            this.runCache = undefined;
        }
    }

    async startVisualizer(toVisualize: ProcedureWithOptions<any>[]): Promise<void> {
        if(this.runCache !== undefined)
            await this.abortVisualizer();
        
        // Starts the new visualizer
        this.runCache = this.internal_startVisualizer(toVisualize);

        await this.runCache;
    }

    abortVisualizer(): Promise<void> {
        if(this.runCache === undefined)
            return Promise.resolve();

        this.abortController.abort();

        return this.runCache;
    }

    isRunning(): boolean {
        return this.runCache !== undefined;
    }
}