<template>
    <v-menu :close-delay="0" v-model="menuOpen" :disabled="props.menu.disabled === true" :open-delay="0" :open-on-hover="!props.topLevel" :location="props.topLevel ? 'bottom' : 'right'" transition="none">
        <template v-if="!props.topLevel" v-slot:activator="{ props: p }">
            <tr :title="props.menu.title" v-bind="p" :class="{'cursor-pointer': true, 'disabled': props.menu.disabled === true}">
                <td>
                    <v-icon v-if="props.menu.icon" :icon="props.menu.icon"></v-icon>
                </td>
                <td>
                    <input :disabled="props.menu.disabled === true" type="button" :value="props.menu.text" />
                </td>
                <td>
                    <v-icon v-if="!props.topLevel" icon="mdi-menu-right"></v-icon>
                </td>
            </tr>
        </template>
        <template v-else v-slot:activator="{ props: p }">
            <span class="cursor-pointer mx-1" v-bind="p">
                {{ props.menu.text }}
            </span>
        </template>

        <v-sheet class="d-flex flex-column">

        <table>
            <tbody>
                <TBItem :item="itm" v-for="itm, idx of renderItems" :key="idx"/>
            </tbody>
        </table>

        </v-sheet>
    </v-menu>
</template>

<style lang="scss" scoped>
.v-icon{
    opacity: .7 !important;
}

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