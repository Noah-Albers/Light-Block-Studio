<template>
    
    <h2 class="text-center mb-3" style="color: #3f3f3f">Block Settings</h2>

    <template v-for="(source, index) in model.getSources()" :key="index">
        <v-divider v-if="index === 0" class="mt-2 mb-2"></v-divider>
        <div class="px-4">
            <component :is="getSourceView(source.getUniqueSourceName())" :source="source" :blockData="props.blockData" />
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
    </template>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { INodeModel } from '@nodes/definitions/Node';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import NumberDataSourceView from "./datasourceviews/NumberDataSource.vue";
import ColorDataSourceView from './datasourceviews/ColorDataSource.vue';
import ColorRangeDataSourceView from './datasourceviews/ColorRangeDataSource.vue';

const mappings = {
    "number": NumberDataSourceView,
    "color": ColorDataSourceView,
    "colorrange": ColorRangeDataSourceView
}

// Gets a IDataSource view by name and returns the component to render (Or undefined if not found)
function getSourceView(name: string) {
    let guess = mappings[name as keyof typeof mappings];

    if (guess !== undefined)
        return guess

    return undefined;
}

const props = defineProps({
    model: {
        type: Object as PropType<INodeModel>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    }
})

</script>