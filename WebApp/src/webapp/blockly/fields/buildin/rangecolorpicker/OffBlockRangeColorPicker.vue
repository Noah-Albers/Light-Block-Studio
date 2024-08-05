<template>
    <div class="d-flex justify-space-between align-center ga-4">
        <v-menu :close-on-content-click="false" class="">
            <template v-slot:activator="{ props }">
                <v-btn variant="outlined" v-bind="props">
                    {{ source.getDisplayTitle() }}:
                    <svg width="80" height="30" class="preview">
                        <linearGradient x1="0%" y1="60%" x2="100%" y2="40%" :id="gradiant_id">
                            <stop offset="0%" :stop-color="previewFirst"></stop>
                            <stop offset="40%" :stop-color="previewFirst"></stop>
                            <stop offset="60%" :stop-color="previewSecond"></stop>
                            <stop offset="100%" :stop-color="previewSecond"></stop>
                        </linearGradient>
                        <rect rx="4" ry="4" x="0" y="0" height="100%" width="100%"
                            :style="`fill: url('#${gradiant_id}');`"></rect>
                    </svg>
                </v-btn>
            </template>

            <ColorPicker v-model="props.blockData[source.getKey()].first"
                v-model:secondary="props.blockData[source.getKey()].second"
                :cache="props.cache"
                />
        </v-menu>

        <v-icon v-tooltip:left="source.getInformation()" v-bind="props" icon="mdi-information-outline"></v-icon>
    </div>
</template>

<style lang="scss" scoped>
.preview {
    margin-left: .4rem;
    border: 1px solid black;
    border-radius: 4px;
}
</style>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IDataSource } from '@nodes/definitions/DataSource';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import ColorPicker from "@webapp/widgets/colorpicker/ColorPicker.vue"
import { calculatePreview } from '@webapp/utils/color/VariableColorConverter';
import { computed } from 'vue';
import { CachedRangeColor, ColorRangeType, HSVColorRange } from '@nodes/implementations/datasources/ColorRangeDataSource';
import { onMounted } from 'vue';
import { ComputedRef } from 'vue';

const gradiant_id = "grd" + Date.now();

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

const previewFirst = computed(() => {
    return calculatePreview(props.blockData[props.source.getKey()].first);
});

const previewSecond = computed(() => {
    return calculatePreview(props.blockData[props.source.getKey()].second);
})

</script>