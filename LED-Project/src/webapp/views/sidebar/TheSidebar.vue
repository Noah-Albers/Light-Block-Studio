<template>
    <Splitpanes horizontal class="default-theme" :push-other-panes="false">
        <Pane style="overflow: auto;" class="position-relative">
            <TheUpperSidebar />
        </Pane>
        <Pane style="overflow: auto;" class="position-relative">

            <!--The variable view if no block is selected-->
            <TheVariableView v-if="blockData === null" />

            <!--Overwrite the view with the blockly-block view if selected-->
            <TheOffBlock v-else :cache="blockData.cache" :blockData="blockData.dataObj" :model="blockData.model" />


        </Pane>
    </Splitpanes>
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import TheVariableView from '../variables/TheVariableView.vue';
import { Block } from 'blockly';
import { useSignal } from '@webapp/utils/vue/VueSignalListener';
import { Signals } from '@webapp/utils/signals/Signals';
import TheOffBlock from "@webapp/views/offblock/TheOffBlock.vue";
import { computed } from 'vue';
import { getBlockDataObject, getBlockModel, getBlockCache } from '@webapp/blockly/OnBlockUtils';
import TheUpperSidebar from "./TheUpperSidebar.vue";
import { ShallowRef, shallowRef } from 'vue';

// Holds the selected blockly-block
const selectedBlocklyBlock: ShallowRef<Block | null> = shallowRef(null);

/**
 * Computed property that holds some important block-elements like:
 * - The block-model
 * - The block-data-object
 */
const blockData = computed(() => {
    if (selectedBlocklyBlock.value === null)
        return null;

    // Gets the model (If the selected block has one)
    const model = getBlockModel(selectedBlocklyBlock.value);

    // If the block doesn't have a model, no off-block element will be present
    if (model === undefined)
        return null;

    // Gets the block-data object
    const dObj = getBlockDataObject(selectedBlocklyBlock.value);

    // Gets the block cache object
    const cache = getBlockCache(selectedBlocklyBlock.value);

    return {
        cache,
        dataObj: dObj,
        model
    }
});

useSignal(Signals.BLOCKLY_BLOCK_SELECTION_CHANGE, block => selectedBlocklyBlock.value = block);

</script>