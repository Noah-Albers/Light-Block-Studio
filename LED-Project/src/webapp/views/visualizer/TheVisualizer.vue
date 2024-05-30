<template>
    <div class="wrapper" ref="refWrapper"></div>
</template>

<style lang="scss" scoped>
.wrapper {

    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
    min-width: 20vw;

    &>*{
        max-width: 30vw;
    }
}
</style>

<script lang="ts"
    setup>
import { onMounted, ref, watch } from 'vue';
import { useProjectStore } from "../../stores/ProjectStore";
import { storeToRefs } from 'pinia';
import { useProjectImage } from "./VisualisationProjectImageLoader"
import { useSignal } from '@webapp/utils/vue/VueSignalListener';
import { Signals } from '@webapp/utils/signals/Signals';
import { ProcedureWithOptions } from '@procedure/definitions/Procedure';
import { Visualizer } from '@visualizer/index';
import { LEDArray } from '@visualizer/implementations/VisualisationController';

// HTML-Ref
const refWrapper = ref(null as any as Element);

const leds = useProjectImage(refWrapper, onPreviewElementChange);
useSignal(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, onBlocklyPreviewChange);

const visualizer = new Visualizer(onVisualizerPushLeds);

// Event: When the visualizer pushes an update for the leds
function onVisualizerPushLeds(array: LEDArray){
    // Ensures the html preview exists
    if(leds.value === undefined) return;

    // Iterates over all changed leds
    for(let idx in array){
        let ledVal = array[idx];

        let elements = leds.value[idx];

        if(elements === undefined) continue;

        const fill = `fill: rgb(${ledVal.join(",")});`;

        for(let elm of elements)
            elm.setAttribute("style", fill);
    }
}

// Event: The animation that shall play changed
function onBlocklyPreviewChange(preview?: ProcedureWithOptions<any>[]){
    // Clears the preview
    if(leds.value !== undefined)
        for(let ledIdx in leds.value)
            for(let elm of leds.value[ledIdx])
                elm.setAttribute("style","");

    if(preview === undefined){
        visualizer.abortVisualizer();
        return;
    }

    // (Re)starts the visualizer
    visualizer.startVisualizer(preview);
}

function onPreviewElementChange(){
    // Nothing to do, the visualizer will notice automagially
}

</script>