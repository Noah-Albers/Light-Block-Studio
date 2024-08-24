<template>
    <div class="visualizerPreview">
        <div class="wrapper" ref="refWrapper"></div>
    </div>

    <!-- Switch preview -->
    <v-overlay class="align-center justify-center">
        <template #activator="{ props }">
            <v-btn v-bind="props" v-tooltip="$t('visualizer_button_switchPreview')"
                style="position: absolute; top: 1rem; right: 1rem" icon="mdi-swap-horizontal" />
        </template>

        <PreviewPicker v-model="store.selectedPreview" />
    </v-overlay>
</template>

<style lang="scss" scoped>
.visualizerPreview {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    overflow: auto;
}

.wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
    min-width: 20vw;

    &>* {
        max-width: 30vw;
        max-height: 100%;
    }
}
</style>

<script lang="ts"
    setup>
    import { onMounted, ref, onUnmounted } from 'vue';
    import { useProjectImage } from "./VisualisationProjectImageLoader"
    import { useSignal } from '@webapp/utils/vue/VueSignalListener';
    import { Signals } from '@webapp/utils/signals/Signals';
    import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';
    import { ProcedureWithOptions } from '@procedure/definitions/Procedure';
    import { Visualizer } from '@visualizer/index';
    import { LEDMap } from '@visualizer/implementations/VisualisationController';
    import PreviewPicker from "@webapp/widgets/previewpicker/PreviewPicker.vue";
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    import { HSV2RGB, RGB2Single } from "@webapp/utils/color/ColorConverter";

    // HTML-Ref
    const refWrapper = ref(null as any as Element);

    // User store
    const store = useProjectStore();

    const leds = useProjectImage(refWrapper, onPreviewElementChange);
    useSignal(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, onBlocklyPreviewChange);

    const visualizer = new Visualizer(onVisualizerPushLeds);

    // Event: When the visualizer pushes an update for the leds
    function onVisualizerPushLeds(array: LEDMap) {
        // Ensures the html preview exists
        if (leds.value === undefined) return;

        // Iterates over all changed leds
        for (let itm of array) {
            const ledVal = itm[1];
            const idx = itm[0];

            let elements = leds.value[idx];

            if (elements === undefined) continue;

            // Converts the HSV-8-Bit color into RGB
            const asRgb = HSV2RGB(ledVal[0]/255, ledVal[1]/255, ledVal[2]/255);

            const fill = `fill: rgb(${asRgb.r},${asRgb.g},${asRgb.b});`;

            for (let elm of elements)
                elm.setAttribute("style", fill);
        }
    }

    // Event: The animation that shall play changed
    function onBlocklyPreviewChange(preview?: ProcedureWithOptions<any>[]) {
        // Clears the preview
        if (leds.value !== undefined)
            for (let ledIdx in leds.value)
                for (let elm of leds.value[ledIdx])
                    elm.setAttribute("style", "");

        if (preview === undefined) {
            visualizer.abortVisualizer();
            return;
        }

        // (Re)starts the visualizer
        visualizer.startVisualizer(preview);
    }

    function onPreviewElementChange() {
        // Nothing to do, the visualizer will notice automagially
    }

    // Requests the config to be recreated
    onMounted(() => SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD));
    onUnmounted(()=> visualizer.abortVisualizer());
    
    </script>