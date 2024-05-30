<template>
    <pre><code v-html="formattedData"></code></pre>
</template>

<script lang="ts" setup>
import { Signals } from '@webapp/utils/signals/Signals';
import { useSignal } from '@webapp/utils/vue/VueSignalListener';
import { generateCode } from "./CodeGenerator"
import { ref } from 'vue';
import hljs from 'highlight.js';
import { onMounted } from 'vue';
import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';

// Holds the formatted html tags to display
const formattedData = ref("");

// Waits for the config to be created
useSignal(Signals.BLOCKLY_ALL_CREATE_CONFIG, ({setup, loop})=>{
    // Generates the code
    const code = generateCode(setup, loop);
    
    // Highlights the code
    formattedData.value = hljs.highlight(
        code,
        { language: 'arduino' }
    ).value    
});

// Requests the config to be recreated
onMounted(()=>SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD));


</script>