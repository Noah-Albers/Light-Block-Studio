<template>
<TBMenu v-if="(props.item as any).items !== undefined" :menu="(props.item as Menu)"/>
<TBSeperator v-else-if="props.item == 'seperator'"/>
<TBButton v-else :button="(props.item as Button)"/>
</template>

<script lang="ts" setup>

import { PropType } from "vue";
import { MenuItem, Button, Menu } from "./TaskBar";
import TBButton from "./items/TaskbarButton.vue";
import TBMenu from "./items/TaskbarMenu.vue";
import TBSeperator from "./items/TaskbarSeperator.vue";

const props = defineProps({
    item: {
        type: [Object, String] as PropType<MenuItem>,
        required: true
    }
});

</script>