<template>
    <tr @click="props.button.disabled ? undefined : props.button.action()" :class="{'cursor-pointer': true, 'disabled': props.button.disabled === true}" :title="props.button.title">
        <td>
            <v-icon v-if="props.button.icon" :icon="props.button.icon"></v-icon>
        </td>
        <td>
            {{ props.button.text }}
        </td>
        <td></td>
    </tr>
</template>

<style lang="scss" scoped>
.v-icon{
    opacity: .7;
}

.disabled *{
    color: gray;
    cursor: default !important;
}
</style>

<script lang="ts" setup>
import { PropType } from "vue";
import { Button } from "../TaskBar";

const props = defineProps({
    button: {
        type: Object as PropType<Button>,
        required: true
    }
});

</script>