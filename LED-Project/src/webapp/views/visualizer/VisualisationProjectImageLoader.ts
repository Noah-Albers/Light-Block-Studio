import { BuildInPreviews, useProjectStore } from '@webapp/stores/ProjectStore';
import { storeToRefs } from 'pinia';
import { Ref, onMounted, onUnmounted, ref, toRef, toRefs, watch } from 'vue'

export type LEDs = {[key: number]: SVGElement[]};

// Composable function to use signals on components that can be removed from the dom and readded
export function useProjectImage(refWrapper: Ref<Element>, imgChangeCallback: ()=>void) {

    const store = useProjectStore();

    // Holds all loaded leds
    const leds = ref(undefined as undefined | LEDs);

    // Updates the loaded image and fires the event
    function setLoadedImage(htmlContent: string | undefined){
        if(htmlContent === undefined){
            refWrapper.value.innerHTML = "";
            leds.value = [];
        }else {
            // THIS IS A VERY INSECURE OPERATION. BUT BECAUSE Content-Security-Policy FORBIDS SCRIPT TAGS AND SUCH, THIS SHOULD BE SAFE.
            refWrapper.value.innerHTML = htmlContent;
        
            const rawLeds = Array.from(refWrapper.value.querySelectorAll("[led]"));

            leds.value = {};

            for(let rLed of rawLeds){

                let idx = parseInt(rLed.getAttribute("led")!);
                if(leds.value[idx] === undefined)
                    leds.value[idx] = [];

                leds.value[idx].push(rLed as SVGElement);
            }
        }

        imgChangeCallback();
    }

    // Loads the currently set image into the component
    async function loadImage() {

        // Validates the preview
        if(typeof store.selectedPreview === "number"){
            // Ensures the selected preview is within the correct confines
            if(store.selectedPreview < 0 || store.selectedPreview >= store.previews.length){
                
                setTimeout(()=>{
                    // Resets the preview and continues
                    store.resetPreview();
                }, 500);
                return;
            }

            // Loads the custom svg
            setLoadedImage(store.previews[store.selectedPreview]);
            return;
        }

        // Otherwise loads one of the default values

        try {
            // Validates to be one of the build-in previews
            if(!BuildInPreviews.includes(store.selectedPreview)){
                setTimeout(()=>{
                    // Resets the preview and continues
                    store.resetPreview();
                }, 500);
                return;
            }


            // Loads the preview
            const content = await (await fetch("previews/"+store.selectedPreview)).text();
            setLoadedImage(content);
        }catch(err){
            console.error("Failed to request preview ",err);
        }
    }

    onMounted(loadImage);
    watch(toRefs(store).selectedPreview, loadImage);

    return leds;
}