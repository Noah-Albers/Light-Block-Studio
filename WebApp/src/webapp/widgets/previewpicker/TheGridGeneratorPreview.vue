<template>
<!--TODO: Lang-->

<v-card class="shell">
    <v-toolbar :elevation="4" :title="'Create a grid-preview of varriging size'" color="green">
    </v-toolbar>

    <div class="d-flex">
        <!--Left side (Preview for the svg)-->
        <div class="visualizerPreview mx-5">
            <div class="wrapper" ref="refWrapper"></div>
        </div>
    
        <!--Right side (Configuration field)-->
        <div>
            <div class="d-flex pb-8 mx-5 mt-5">
                <v-text-field
                    :model-value="generationSettings.width" @update:model-value="e=>onChangeSettings(e,'width')" hide-details
                    :label="'Width'"
                    density="compact"
                    class="pr-4"
                    />
            
                <v-text-field
                    :model-value="generationSettings.height" @update:model-value="e=>onChangeSettings(e,'height')" hide-details
                    :label="'Height'"
                    density="compact"
                    />
            </div>
        
            <div class="d-flex pb-4 mx-5">
                <v-text-field
                    :model-value="generationSettings.idLength" @update:model-value="e=>onChangeSettings(e,'idLength')" hide-details
                    :label="'ID-Length'"
                    v-tooltip="'How many leds shall have the same id'"
                    density="compact" class="pr-4"
                    />
                <v-text-field
                    :model-value="generationSettings.startId" @update:model-value="e=>onChangeSettings(e,'startId')" hide-details
                    :label="'Start-ID'"
                    v-tooltip="'ID to start from (0 is the default)'"
                    density="compact"
                    />
            </div>
            
            <div class="text-subtitle-1 text-center mb-1 mx-5">Rotation</div>
            <div class="d-flex justify-center mb-6 mx-5">
                <v-btn-toggle v-model="generationSettings.rotation" mandatory shaped>
                    <v-btn text="0°" :value="0"/>
                    <v-btn text="90°" :value="90"/>
                    <v-btn text="180°" :value="180"/>
                    <v-btn text="270°" :value="-90"/>
                </v-btn-toggle>
            </div>
        
            <div class="text-subtitle-1 text-center mb-1 mx-5">Variant</div>
            <div class="d-flex justify-center mb-6 mx-5">
                <v-btn-toggle v-model="generationSettings.type" mandatory shaped>
                      <v-btn prepend-icon="mdi-led-strip" text="Stripe" value="stripe"/>
                      <v-btn prepend-icon="mdi-matrix" text="Matrix" value="matrix"/>
                </v-btn-toggle>
            </div>
        
        
            <div class="text-subtitle-1 text-center mb-1 mx-5">Mode</div>
            <div class="d-flex justify-center mx-5 mb-5">
                <v-btn-toggle v-model="generationSettings.mode" mandatory shaped>
                      <v-btn prepend-icon="mdi-current-dc" text="Single direction" value="normal"/>
                      <v-btn prepend-icon="mdi-sine-wave" text="Alternating" value="alternating"/>
                </v-btn-toggle>
            </div>
        </div>
    </div>

  <v-card-actions>
    <v-spacer/>
    <v-btn @click=onProjectAddClicked variant="outlined" prepend-icon="mdi-plus" color="green" class="my-5">Add to project</v-btn>
    <v-spacer/>
  </v-card-actions>

</v-card>
</template>

<style lang="scss" scoped>

.visualizerPreview {
    min-width: 20rem;
    align-content: center;
    min-height: 20rem;
}

.wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
    min-width: 20vw;
}

</style>

<script setup lang="ts">
import { Registry } from '@registry/Registry';
import { LEDMap } from '@visualizer/implementations/VisualisationController';
import { Visualizer } from '@visualizer/index';
import { useProjectStore } from '@webapp/stores/ProjectStore';
import { HSV2RGB } from '@webapp/utils/color/ColorConverter';
import PreviewGridSVGGenerator from '@webapp/utils/PreviewGridSVGGenerator';
import { useProjectImage } from '@webapp/views/visualizer/VisualisationProjectImageLoader';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';

// HTML-Ref
const refWrapper = ref(null as any as Element);

// The settings
const generationSettings = reactive({
    height: 5,
    width: 5,
    type: "stripe" as "stripe" | "matrix",
    mode: "alternating" as "normal" | "alternating",
    idLength: 1,
    rotation: 0 as 0 | 90 | -90 | 180,
    startId: 0
});


// Visualizer to preview animations
const visualizer = new Visualizer(onLedsPush);

// Map that holds the leds
let leds: {[key: string/*Id*/]: Element[]} = {};

const emit = defineEmits<{
    // Emits once the user is finished and has added the preview
    (e: "finished"): void,
}>();


// Event: Any number-value changes
// Used to filter the numbers from the invalid strings or empty
function onChangeSettings(value: string, type: keyof typeof generationSettings){
    // Tries to parse the value
    let parsed = parseInt(value);
    if(isNaN(parsed)) return;

    // Updates the settings
    (generationSettings[type] as any) = parsed;
}

// Event: When the visualizer pushes an update
function onLedsPush(changeMap: LEDMap){
    // Iterates over all changed leds
    for (let itm of changeMap) {
        const ledVal = itm[1];
        const idx = itm[0];

        let elements = leds[idx];

        if (elements === undefined) continue;

        // Converts the HSV-8-Bit color into RGB
        const asRgb = HSV2RGB(ledVal[0]/255, ledVal[1]/255, ledVal[2]/255);

        const fill = `fill: rgb(${asRgb.r},${asRgb.g},${asRgb.b});`;

        for (let elm of elements)
            elm.setAttribute("style", fill);
    }
}

// Updates the svg-image on the DOM
function updateNewImage(){
    const svgImage = PreviewGridSVGGenerator.generate({
        ...generationSettings,
        spaceBetweenX: 2, spaceBetweenY: 2,
        rectSizeX: 7, rectSizeY: 7,
        stripePadding: 2,
    });
    
    // Creates the image
    // THIS IS A VERY INSECURE OPERATION. BUT BECAUSE Content-Security-Policy FORBIDS SCRIPT TAGS AND SUCH, THIS SHOULD BE SAFE.
    refWrapper.value.innerHTML = svgImage;
    
    // Resets the led map
    leds = {};
    // Gets the inserted led elements
    const ledsRaw = Array.from(refWrapper.value.querySelectorAll("[led]"));
    // and mapps them into a id: html-element-array format
    for(let itm of ledsRaw){
        const id = itm.getAttribute("led")!;
        if(leds[id] === undefined)
            leds[id] = [];
        leds[id].push(itm);
    }

    // Calculates how many ids exist
    const idSize = Math.ceil(generationSettings.width * generationSettings.height / generationSettings.idLength)

    // Resets the visualizer with a default procedure that just shows how the grid works.
    visualizer.startVisualizer([
        {
            procedure: Registry.procedures.loop,
            options: {
                repeats: -1,
                sub: [
                {
                    procedure: Registry.procedures.ledSteps,
                    options: {
                        h: 128, s: 180, v: 255,
                        idxStart: 0, ledDelay: 100, stepDelay: 500,
                        ledsReversed: false, stepsReversed: false,
                        steps: idSize, stepSize: 1, stepSpace: 0,
                        isParallel: false
                    }
                },
                {
                    procedure: Registry.procedures.multiLed,
                    options: {
                        h: 0, s: 0, v: 0, idxEndExclusive: idSize, idxStart: 0,ledDelay: 100
                    }
                },
                ]
            }
        }
    ])
}

// Event: When the user clicks to button to add this to the project
function onProjectAddClicked(){
    useProjectStore().previews.push({
        ...generationSettings,
        __type: "grid"
    });

    emit("finished");
}

watch(generationSettings, updateNewImage);
onMounted(updateNewImage);
// Ensures the visualizer is removed properly
onUnmounted(()=> visualizer.abortVisualizer());

</script>