
<template>
    <div ref="refInner" class="inner">
        <ColorPicker
            v-if="mainModel !== undefined"
            
            v-model="mainModel"
            v-model:secondary="secondaryModel"
            @preview="onModelUpdate"
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
    import { VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
    
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

    // The models for the color picker (Or range picker)
    const secondaryModel: Ref<VariableColorType | undefined> = ref();
    const mainModel: Ref<VariableColorType | undefined> = ref();

    // Callbacks which send changes to the value and a cached hex-string back.
    let onChange: ((mainValue: VariableColorType, mainCachedColor: string, secondValue?: VariableColorType, secondCache?: string)=>void) | undefined;
    
    function onModelUpdate(mainHex: string, secondHex?: string){
        onChange!(
            mainModel.value!,
            mainHex,
            secondaryModel.value,
            secondHex
        )
    }

    // Event: Attach is requested
    function onRequestAttachment({elm, onChange: onC, mainValue, secondValue, disableArrows, disableShadows}: EventArgsBlocklyClrReqAttach){

        // Updates the internal model value and registers the change handler
        secondaryModel.value = secondValue === undefined ? undefined : secondValue.map(x=>x) as VariableColorType;
        onChange = onC;
        
        // Updates the config
        config.value = {
            noArrows: disableArrows || false,
            noShadows: disableShadows || false
        }
        
        // Moves the child
        elm.appendChild(refInner.value);

        // Sets the main model to render the color picker only now
        mainModel.value = mainValue.map(x=>x) as VariableColorType;
    }

    // Event: Detach is requested (Meaning cleanup / dispose)
    function onRequestDetach(){
        refInner.value.parentElement!.removeChild(refInner.value);

        // Cleanup
        mainModel.value = undefined;
        secondaryModel.value = undefined;
        onChange = undefined;
    }

    // Registers the signal-listeners for the attach and detach requests
    useSignal(Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH, onRequestAttachment);
    useSignal(Signals.BLOCKLY_COLOR_FIELD_REQ_DETACH, onRequestDetach);

    // Unmountes the dom element to hide it (But it's stored in memory to use later on)
    onMounted(()=>{
        refInner.value.parentElement!.removeChild(refInner.value);
    })

</script>

