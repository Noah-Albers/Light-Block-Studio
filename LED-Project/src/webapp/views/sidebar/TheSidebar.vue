<template>
    <Splitpanes horizontal
        class="default-theme"
        :push-other-panes="false">
        <Pane style="overflow: auto">
            <TheUpperSidebar/>
        </Pane>
        <Pane style="overflow: auto;">

            <!--Overwrite the view with the blockly-block view if selected-->
            <TheOffBlock v-if="blockData !== null" :cache="blockData.cache" :blockData="blockData.dataObj" :model="blockData.model" />

            <!--The normal table view-->
            <v-tabs v-else
                density="compact"
                v-model="tabs.lower"
                align-tabs="center"
                bg-color="deep-purple-accent-4">

                <!--Tab selector for the variables-->
                <v-tab title="Variables"
                    value="variables">
                    <v-icon icon="mdi-variable" />
                </v-tab>


                <!--Tab selector for testing-->
                <v-tab title="Test tab"
                    value="test">
                    <v-icon icon="mdi-test-tube" />
                </v-tab>
            </v-tabs>

            <v-window v-if="blockData === null"
                v-model="tabs.lower">

                <!--Variables tab-->
                <v-window-item value="variables">
                    <TheVariableView />
                </v-window-item>

                <!--Testing tab-->
                <v-window-item value="test">
                    Two
                </v-window-item>
            </v-window>
        </Pane>
    </Splitpanes>
</template>

<script setup lang="ts">
    import { Splitpanes, Pane } from 'splitpanes'
    import 'splitpanes/dist/splitpanes.css'
    import TheVariableView from '../variables/TheVariableView.vue';
    import { ref } from 'vue';
    import { Ref } from 'vue';
    import { Block } from 'blockly';
    import { useSignal } from '@webapp/utils/vue/VueSignalListener';
    import { Signals } from '@webapp/utils/signals/Signals';
    import TheOffBlock from "@webapp/views/offblock/TheOffBlock.vue";
    import { computed } from 'vue';
    import { getBlockDataObject, getBlockModel, getBlockCache } from '@webapp/blockly/OnBlockUtils';
    import TheUpperSidebar from "./TheUpperSidebar.vue";
    import { ShallowRef, shallowRef } from 'vue';

    const tabs = ref({
        lower: null
    });

    // Holds the selected blockly-block
    const selectedBlocklyBlock: ShallowRef<Block | null> = shallowRef(null);

    /**
     * Computed property that holds some important block-elements like:
     * - The block-model
     * - The block-data-object
     */
    const blockData = computed(() => {
        if(selectedBlocklyBlock.value === null)
            return null;

        // Gets the model (If the selected block has one)
        const model = getBlockModel(selectedBlocklyBlock.value);

        // If the block doesn't have a model, no off-block element will be present
        if(model === undefined)
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