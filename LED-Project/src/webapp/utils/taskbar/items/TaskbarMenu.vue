<template>
    <v-menu close-delay="0" v-model="menuOpen" :disabled="props.menu.disabled === true" open-delay="0" :open-on-hover="!props.topLevel" :location="props.topLevel ? 'bottom' : 'right'" transition="none">
        <template v-slot:activator="{ props: p }">
            <div :title="props.menu.title" v-bind="p" :class="{'cursor-pointer mx-1': true, 'disabled': props.menu.disabled === true}">
                <input :disabled="props.menu.disabled === true" type="button" :value="props.menu.text" />
                <v-icon v-if="!props.topLevel" icon="mdi-menu-right"></v-icon>
            </div>
        </template>

        <v-sheet class="d-flex flex-column">
            <TBItem v-for="itm, idx of renderItems" :item="itm" :key="idx"/>
        </v-sheet>
    </v-menu>
</template>

<style lang="scss" scoped>
.disabled, input[disabled]{
    color: gray;
    cursor: default !important;
}
</style>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { Menu } from "../TaskBar";
import TBItem from "../TaskbarItem.vue"
import { computed } from "vue";
import { Signals } from "@webapp/utils/signals/Signals";
import { useSignal } from "@webapp/utils/vue/VueSignalListener";

// If the menu is open
const menuOpen = ref(false);
useSignal(Signals.BLOCKLY_CLICK_IN_WORKSAPCE, ()=>menuOpen.value = false);


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
    if(typeof props.menu.items === "function")
        return props.menu.items();
    return props.menu.items;
});

</script>