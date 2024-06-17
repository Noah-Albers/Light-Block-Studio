<template>
    <v-text-field density="compact" hide-details :label="source.getKey()" v-model="props.blockData[props.source.getKey()]">
        <template v-slot:append>
            <v-tooltip :text="source.getInformation()">
                <template v-slot:activator="{ props }">
                    <v-icon style="opacity: 1;" v-bind="props" icon="mdi-information-outline"></v-icon>
                </template>
            </v-tooltip>
        </template>

    </v-text-field>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IDataSource } from '@nodes/definitions/DataSource';
import { BlockData } from '@webapp/blockly/OnBlockUtils';

const props = defineProps({
    source: {
        type: Object as PropType<IDataSource<string, number>>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    }
})

</script>