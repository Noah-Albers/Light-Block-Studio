<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" v-bind="props">
                {{ source.getKey() }}:<div :style="'background:'+previewStore" class="preview"></div>
            </v-btn>
        </template>

        <ColorPicker
            v-model="props.blockData[source.getKey()]" 
            @preview="mainHex=>previewStore = mainHex"
            />
    </v-menu>
</template>

<style lang="scss" scoped>
.preview {
    margin-left: .4rem;
    width: 40px;
    height: 20px;
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
import { ref } from 'vue';

const previewStore = ref("");


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

</script>