<template>
<TBMenu :top-level="true" :menu="itm"  v-for="itm, idx of props.taskbar" :key="idx"/>
</template>

<script lang="ts" setup>
import TBMenu from "./items/TaskbarMenu.vue";
import { PropType } from "vue";
import { Menu } from "./TaskBar";

const props = defineProps({
    taskbar: {
        type: Object as PropType<Menu[]>,
        required: true
    }
});

</script>