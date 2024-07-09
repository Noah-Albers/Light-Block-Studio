<template>
    <div class="d-flex justify-space-between align-center ga-4">
        <v-menu :close-on-content-click="false" :close-on-back="false" class="">
            <template v-slot:activator="{ props: aProps }">
                <v-btn variant="outlined" v-bind="aProps">
                    {{ source.getKey() }}:<div :style="'background:' + props.cache.display" class="preview"></div>
                </v-btn>
            </template>
    
            <ColorPicker
                v-model="props.blockData[source.getKey()]"
                :cache="cache"
                />
        </v-menu>
    
        <v-icon v-tooltip:left="source.getInformation()" v-bind="props" icon="mdi-information-outline"></v-icon>
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
import { CachedColor, HSVColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
import ColorPicker from "@webapp/widgets/colorpicker/ColorPicker.vue"
import { ComputedRef } from 'vue';

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