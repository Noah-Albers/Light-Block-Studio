import { IVisualisationController } from "@visualizer/definitions/VisualisationController";
import { VisualizerAbortError } from "@visualizer/definitions/VisualizerAbortError";
import { HSV2RGB } from "@webapp/utils/color/ColorConverter";

/**
 * For (possibly) every led index this holds the led colors in an array of RGB with a range of 0 - 255
 */

// LED-Map holds an index and it's corresponding color in 8-bit-form (0-255) HSV-Color values
export type LEDMap = Map<number,[number,number,number]>;

// Event callback that takes in the new leds that have yet to be pushed to the screen
export type LEDPushCallback = (leds: LEDMap)=>void;

export class VisualisationController implements IVisualisationController {

    // The abort signal used to abort the current visualisation
    private abortSignal: AbortSignal;

    // Holds the leds that have to be pushed to the screen
    private ledCache: LEDMap = new Map<number,[number,number,number]>();

    // Callback for leds that are pushed
    private onPushLeds: LEDPushCallback;

    // Stores that start date to offer a way to calculate the millies ellapsed since the start
    private startTime: number = Date.now();

    constructor(abortSignal: AbortSignal, onPushLeds: LEDPushCallback){
        this.abortSignal = abortSignal;
        this.onPushLeds = onPushLeds;
    }
    
    setLedHSV(idx: number, h: number, s: number, v: number): void {
        this.ledCache.set(idx, [h,s,v]);
    }

    pushUpdate(): void {
        // Ensures no further updates are send after an abort
        if(this.abortSignal.aborted)
            return;

        this.onPushLeds(this.ledCache);
        this.ledCache.clear();
    }

    sleep(ms: number): Promise<void> {
        const self = this;

        return new Promise((res, rej)=>{

            if(self.abortSignal.aborted){
                rej(new VisualizerAbortError());
                return;
            }

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