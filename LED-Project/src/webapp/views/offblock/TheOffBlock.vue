<template>
    Hey im the off-block view of the block:
    Data: {{ blockData }}
    <v-text-field label="Data" v-model="props.blockData['clr'][0]"></v-text-field>
    List:<br/>
    <component v-for="(source, index) in model.getSources()" :key="index" :is="getSourceView(source.getUniqueSourceName())"
        :source="source" :blockData="props.blockData" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { INodeModel } from '@nodes/definitions/Node';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import NumberDataSourceView from "./datasourceviews/NumberDataSource.vue";
import ColorDataSourceView from './datasourceviews/ColorDataSource.vue';

const mappings = {
    "number": NumberDataSourceView,
    "color": ColorDataSourceView
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