<template>
    <div :title="props.button.title">
        <input :disabled="props.button.disabled === true" type="button" class="mx-1" :value="props.button.text" @click="props.button.action"/>
        <!--This icon is here to space the buttons correctly with the menus-->
        <v-icon></v-icon>
    </div>
</template>

<style lang="scss" scoped>
input[disabled]{
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