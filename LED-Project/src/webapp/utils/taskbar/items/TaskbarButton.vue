<template>
    <div>
        <input type="button" class="mx-1" :value="props.button.text" @click="props.button.action"/>
        <!--This icon is here to space the buttons correctly with the menus-->
        <v-icon></v-icon>
    </div>
</template>

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