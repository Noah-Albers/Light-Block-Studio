import { useProjectStore } from '@webapp/stores/ProjectStore';
import { storeToRefs } from 'pinia';
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue'

export type LEDs = {[key: number]: SVGElement[]};

// Composable function to use signals on components that can be removed from the dom and readded
export function useProjectImage(refWrapper: Ref<Element>, imgChangeCallback: ()=>void) {

    const {preview} = storeToRefs(useProjectStore());
    
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

        if(!preview.value.startsWith("@")){
            setLoadedImage(preview.value);
            return;
        }

        try {
            // Validates to be a simple file name and not an url or something else
            if(!/^@[a-zA-Z0-9_\-.]+$/g.test(preview.value)){
                setTimeout(()=>{
                    // Resets the preview and continues
                    preview.value = "@Goggles.svg";
                }, 500);
                return;
            }


            // Loads the preview
            const content = await (await fetch("previews/"+preview.value.substring(1))).text();
            setLoadedImage(content);
        }catch(err){
            console.error("Failed to request preview ",err);
        }
    }

    onMounted(loadImage);
    watch(preview, loadImage);

    return leds;
}