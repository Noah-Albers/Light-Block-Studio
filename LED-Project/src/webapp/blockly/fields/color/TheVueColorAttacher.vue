
<template>
    <div ref="refInner" class="inner">
        <ColorPicker
            v-if="mainModel !== undefined"
            
            :cache="cache!"
            v-model="mainModel"
            v-model:secondary="secondaryModel"
            :disable-arrows="config.noArrows"
            :disable-shadows="config.noShadows"
            />
    </div>
</template>

<script lang="ts" setup>
    import { Signals } from '@webapp/utils/signals/Signals';
    import { useSignal } from '@webapp/utils/vue/VueSignalListener';
    import { Ref, ref, onMounted } from 'vue';
    import ColorPicker from "../../../widgets/colorpicker/ColorPicker.vue";
    import { EventArgsBlocklyClrReqAttach } from "@webapp/utils/signals/SignalArgumentTypes"
    import { CachedColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
    import { ComputedRef } from 'vue';
    import { CachedRangeColor } from '@nodes/implementations/datasources/ColorRangeDataSource';
    
    /**
     * 
     * Hello, this is a very disgusting file which is always included (and rendered) inside the blockly-workspace
     * It is used to proved a way for vuejs to work with blockly-field's editor. In this case only the color picker or range color picker.
     * 
     * We use Signals to let the field request this component to staight up RIP THE DOM OPEN and reinsert it into the
     * field's editor. Meaning vuejs things its inside a completely different part of the app than it actually is.
     * 
     * But if we ignore that, all other cool vuejs stuff works. As see with the ColorPicker. 
     * 
     * So yeah besides angering GOD HIMSELF, this should all be okay... maybe...
     * 
     */



    // Reference onto the dom-element (Color picker)
    const refInner = ref(null) as any as Ref<HTMLDivElement>

    // Config for the color picker (Is send via the request)
    const config = ref({
        noArrows: false,
        noShadows: false
    })

    let mainModel: Ref<VariableColorType | undefined> = ref(undefined);
    let cache: ComputedRef<CachedColor | CachedRangeColor> | undefined = undefined;

    // The models for the color picker (Or range picker)
    let secondaryModel: Ref<VariableColorType | undefined> = ref(undefined);

    // Event: Attach is requested
    function onRequestAttachment({elm, cache: c, mainValue, secondValue, disableArrows, disableShadows}: EventArgsBlocklyClrReqAttach){

        mainModel.value = mainValue;
        cache = c;

        secondaryModel.value = secondValue;

        // Updates the config
        config.value = {
            noArrows: disableArrows || false,
            noShadows: disableShadows || false
        }
        
        // Moves the child
        elm.appendChild(refInner.value);
    }

    // Event: Detach is requested (Meaning cleanup / dispose)
    function onRequestDetach(){
        refInner.value.parentElement!.removeChild(refInner.value);

        // Cleanup
        mainModel.value = undefined;
        cache = undefined;
        secondaryModel.value = undefined;
    }

    // Registers the signal-listeners for the attach and detach requests
    useSignal(Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH, onRequestAttachment);
    useSignal(Signals.BLOCKLY_COLOR_FIELD_REQ_DETACH, onRequestDetach);

    // Unmountes the dom element to hide it (But it's stored in memory to use later on)
    onMounted(()=>{
        refInner.value.parentElement!.removeChild(refInner.value);
    })

</script>

