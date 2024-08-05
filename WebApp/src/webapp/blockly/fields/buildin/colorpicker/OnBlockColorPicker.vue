
<template>
    <ColorPicker v-model="props.blockData[source.getKey()]" :cache="props.cache" />
</template>

<script setup lang="ts">
import { IDataSource } from '@nodes/definitions/DataSource';
import { CachedColor, HSVColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import ColorPicker from '@webapp/widgets/colorpicker/ColorPicker.vue';
import { PropType } from 'vue';

const props = defineProps({
    source: {
        type: Object as PropType<IDataSource<VariableColorType, HSVColor>>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    },
    cache: {
        type: Object as PropType<CachedColor>,
        required: true
    }
})
</script>