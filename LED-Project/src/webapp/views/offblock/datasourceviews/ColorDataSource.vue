<template>
    <div class="d-flex justify-space-between align-center ga-4">
        <v-menu :close-on-content-click="false" class="">
            <template v-slot:activator="{ props }">
                <v-btn variant="outlined" v-bind="props">
                    {{ source.getKey() }}:<div :style="'background:' + preview" class="preview"></div>
                </v-btn>
            </template>
    
            <ColorPicker v-model="props.blockData[source.getKey()]" />
        </v-menu>
    
        <v-tooltip :text="source.getInformation()">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-information-outline"></v-icon>
            </template>
        </v-tooltip>
    </div>
</template>

<style lang="scss" scoped>
.preview {
    margin-left: .4rem;
    width: 60px;
    height: 30px;
    border: 1px solid black;
    border-radius: 4px;
}
</style>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IDataSource } from '@nodes/definitions/DataSource';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import { HSVColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
import ColorPicker from "@webapp/widgets/colorpicker/ColorPicker.vue"
import { calculatePreview } from '@webapp/utils/color/VariableColorConverter';
import { computed } from 'vue';

const props = defineProps({
    source: {
        type: Object as PropType<IDataSource<VariableColorType, HSVColor>>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    }
})


const preview = computed(() => {
    return calculatePreview(props.blockData[props.source.getKey()]);
})

</script>