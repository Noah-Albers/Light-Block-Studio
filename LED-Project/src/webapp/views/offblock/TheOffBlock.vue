<template>
    Hey im the off-block view of the block:
    Data: {{ blockData }}
    <v-text-field label="Data" v-model="blockData['abc']"></v-text-field>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { INodeModel } from '@nodes/definitions/Node';
import { BlockData } from '@webapp/blockly/OnBlockUtils';

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