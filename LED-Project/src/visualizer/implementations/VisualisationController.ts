import { IVisualisationController } from "@visualizer/definitions/VisualisationController";
import { VisualizerAbortError } from "@visualizer/definitions/VisualizerAbortError";
import { HSV2RGB } from "@webapp/utils/color/ColorConverter";

export type LEDArray = {[ledIndex: number]: [number,number,number]};
export type LEDPushCallback = (leds: LEDArray)=>void;

export class VisualisationController implements IVisualisationController {

    // The abort signal used to abort the current visualisation
    private abortSignal: AbortSignal;

    /**
     * Holds leds that have yet to be pushed to the screen
     * 
     * the three numbers are the RGB values as RED, GREEN, BLUE
     */
    private ledCache: LEDArray = {};

    // Callback for leds that are pushed
    private onPushLeds: LEDPushCallback;

    // Stores that start date to offer a way to calculate the millies ellapsed since the start
    private startTime: number = Date.now();

    constructor(abortSignal: AbortSignal, onPushLeds: LEDPushCallback){
        this.abortSignal = abortSignal;
        this.onPushLeds = onPushLeds;
    }
    
    setLedHSV(idx: number, h: number, s: number, v: number): void {
        this.ledCache[idx] = Object.values(HSV2RGB(h, s, v)) as [number,number,number];
    }

    pushUpdate(): void {
        // Ensures no further updates are send after an abort
        if(this.abortSignal.aborted)
            return;

        this.onPushLeds(this.ledCache);
    }

    sleep(ms: number): Promise<void> {
        const self = this;

        return new Promise((res, rej)=>{

            let timeoutId: NodeJS.Timeout = setTimeout(onDone, ms);
            
            function onAbort(){
                clearTimeout(timeoutId);
                self.abortSignal.removeEventListener("abort", onAbort);
                rej(new VisualizerAbortError());
            }
            
            function onDone(){
                self.abortSignal.removeEventListener("abort", onAbort);
                res();
            }
            
            self.abortSignal.addEventListener("abort", onAbort);

        });
    }

    /**
     * Returns the number of milliseconds elapsed since the creation of the VisualisationController instance.
     * 
     * @returns The number of milliseconds elapsed since the creation of the VisualisationController instance.
     */
    millis(): number {
        return Date.now() - this.startTime;
    }
}