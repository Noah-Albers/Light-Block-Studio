<template>
    <h2 class="text-center mb-3" style="color: #3f3f3f">Block Settings</h2>

    <template v-for="(source, index) in model.getSources()" :key="index">
        <v-divider v-if="index === 0" class="mt-2 mb-2"></v-divider>
        <div class="px-4">
            <component :is="getOffBlockView(source)"
                :source="source"
                :cache="cache[source.getKey()]?.value"
                :blockData="props.blockData"
                />
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
    </template>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { INodeModel } from '@nodes/definitions/Node';
import { BlockData, Cache } from '@webapp/blockly/OnBlockUtils';
import { getOffBlockView } from '@webapp/blockly/RegisterBlockly';

const props = defineProps({
    model: {
        type: Object as PropType<INodeModel>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    },
    cache: {
        type: Object as PropType<Cache>,
        required: true
    }
})

</script>