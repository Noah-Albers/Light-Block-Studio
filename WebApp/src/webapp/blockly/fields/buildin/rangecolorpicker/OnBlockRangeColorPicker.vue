
<template>
    <ColorPicker
        v-model="props.blockData[source.getKey()].first"
        v-model:secondary="props.blockData[source.getKey()].second" :cache="props.cache" />
</template>

<script setup lang="ts">
import { IDataSource } from '@nodes/definitions/DataSource';
import { CachedRangeColor, ColorRangeType, HSVColorRange } from '@nodes/implementations/datasources/ColorRangeDataSource';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import ColorPicker from '@webapp/widgets/colorpicker/ColorPicker.vue';
import { PropType } from 'vue';

const props = defineProps({
    source: {
        type: Object as PropType<IDataSource<ColorRangeType, HSVColorRange>>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    },
    cache: {
        type: Object as PropType<CachedRangeColor>,
        required: true
    }
})
</script>