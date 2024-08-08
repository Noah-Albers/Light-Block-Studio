<template>
    <v-select density="compact"
    item-title="display"
    item-value="key"
    :items="items" variant="outlined" hide-details :label="source.getDisplayTitle()"
        v-model="props.blockData[props.source.getKey()]">
        <template v-slot:append>
            <v-icon v-tooltip:left="source.getInformation()" style="opacity: 1;" v-bind="props"
                icon="mdi-information-outline"></v-icon>
        </template>
    </v-select>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { BlockData } from '@webapp/blockly/OnBlockUtils';
import { OptionDataSource } from '@nodes/implementations/datasources/OptionDataSource';

const items = computed(() => {
    const opts = props.source.getOptions();

    return Object.keys(opts).map(key=>{
        return {key: key, display: opts[key]};
    })
});

const props = defineProps({
    source: {
        type: Object as PropType<OptionDataSource>,
        required: true
    },
    blockData: {
        type: Object as PropType<BlockData>,
        required: true
    },
    cache: Object
})

</script>