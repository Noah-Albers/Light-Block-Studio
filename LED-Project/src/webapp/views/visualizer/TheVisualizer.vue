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

const {preview} = storeToRefs(useProjectStore());

// HTML-Ref
const refWrapper = ref(null as any as Element);

// Holds all loaded leds
const leds = ref(undefined as undefined | {[key: number]: SVGElement});

// Loads the currently set image into the component
async function loadImage() {
    let content;

    if(preview.value.startsWith("@")){
        // Validates to be a simple file name and not an url or something else
        if(!/^@[a-zA-Z0-9_\-.]+$/g.test(preview.value)){
            // Resets the preview and continues
            preview.value = "@Goggles.svg";
            return;
        }

        // Loads the preview
        content = await (await fetch("previews/"+preview.value.substring(1))).text();

    }else
        content = preview.value;

    // THIS IS A VERY INSECURE OPERATION. BUT BECAUSE Content-Security-Policy FORBIDS SCRIPT TAGS AND SUCH, THIS SHOULD BE SAFE.
    refWrapper.value.innerHTML = content;

    leds.value = Array.from(refWrapper.value.querySelectorAll("[led]"));
}

onMounted(loadImage);
watch(preview, loadImage);

</script>