<template>
    <v-menu open-delay="0" :open-on-hover="!props.topLevel" :location="props.topLevel ? 'bottom' : 'right'" transition="none">
        <template v-slot:activator="{ props: p }">
            <div v-bind="p" class="cursor-pointer mx-1">
                <input type="button" :value="props.menu.text" />
                <v-icon v-if="!props.topLevel" icon="mdi-menu-right"></v-icon>
            </div>
        </template>

        <v-sheet class="d-flex flex-column">
            <TBItem v-for="itm, idx of renderItems" :item="itm" :key="idx"/>
        </v-sheet>
    </v-menu>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Menu } from "../TaskBar";
import TBItem from "../TaskbarItem.vue"
import { computed } from "vue";

const props = defineProps({
    menu: {
        type: Object as PropType<Menu>,
        required: true
    },
    topLevel: {
        type: Boolean,
        default: false
    }
});

const renderItems=computed(()=>{
    return props.menu.items();
});

</script>