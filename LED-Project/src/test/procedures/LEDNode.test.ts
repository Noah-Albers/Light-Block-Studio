import { IProcedure } from "@procedure/definitions/Procedure";
import { isObject } from "@test/TestUtils";
import { VisualizerAbortError } from "@visualizer/definitions/VisualizerAbortError";
import { VisualisationController } from "@visualizer/implementations/VisualisationController";

/**
 * Asserts that the startNode method of a procedure behaves as expected.
 * 
 * @param procedure The procedure object to test.
 */
async function assertStartNode(procedure: IProcedure<any>) {

    // Uses the VisualisationController
    const aborter = new AbortController();
    const ctrl = new VisualisationController(aborter.signal, onLedPushback);

    function onLedPushback(leds: {[ledIndex: number]: [number, number, number]}){

        // Validates the leds
        if(!Array.isArray(leds))
            onError(`pushLeds() didn't send an array, instead '${leds}'`);

        // Checks every led
        for(let rawIdx in leds){
            let index = parseInt(rawIdx);

            if(!Number.isInteger(index))
                onError(`pushLeds() send a non-integer index: '${rawIdx}'`);

            if(index < 0)
                onError(`pushLeds() send a negative index: '${rawIdx}'`);

            let value = leds[rawIdx];

            if(!Array.isArray(value))
                onError(`pushLeds() send a value which was not an led-array [number, number, number], which was: '${value}'`);

            if(value.length !== 3)
                onError(`pushLeds() send a value which didn't have the length 3 (Red, Green, Blue), which was: '${value}'`);

            // Checks every value
            for(let itm of value)
                if(!Number.isInteger(itm) || itm < 0 || itm > 255)
                    onError(`pushLeds() returned a value which was not an RGB-Value between 0-255, it was: '${itm}'`);
        }

    }

    // An error should be thrown and cancels any async stuff before
    function onError(err: string){
        aborter.abort();

        throw err;
    }

    try {
        // Starts the node
        const promise = procedure.getLEDNode().startNode(procedure.getExampleConfig(), ctrl);
    
        // Waits and aborts the test
        setTimeout(()=>aborter.abort, 100);

        // Waits and aborts the execution
        await promise;
    }catch(err){
        if(err instanceof VisualizerAbortError)
            return;
        throw err;
    }
}

/**
 * Asserts the validity of the led node object.
 * 
 * @param procedure The procedure object for which led node is being asserted.
 * @throws Error if the led node object or its functions are not as expected.
 */
export function assertLedNode(procedure: IProcedure<any>) {
    const node = procedure.getLEDNode();

    // Validate that led node is an object with required functions
    if (!isObject(node)) {
        throw new Error("LEDNode must be an object (Class instance)");
    }

    // Validate that required functions are defined on led node object
    const REQUIRED_FUNCTIONS = ["startNode"];
    for (let funcName of REQUIRED_FUNCTIONS) {
        if (typeof node[funcName as keyof typeof node] !== "function") {
            throw new Error(`'${funcName}' is not defined on LEDNode object`);
        }
    }

    // Assert the results of the functions
    return assertStartNode(procedure);
}