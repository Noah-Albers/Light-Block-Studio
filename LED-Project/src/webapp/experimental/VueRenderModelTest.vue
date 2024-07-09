<template>
    <rect rx="4" @click="menuOpen = true" ry="4" x="0" y="0" height="15" width="25" class="blocklyFieldRect" style="fill-opacity: 1; fill: rgb(255, 0, 0);">
        <foreignObject>
            <v-menu v-model="menuOpen">
              <v-card>Hi</v-card>
            </v-menu>
        </foreignObject>
    </rect>

</template>

<style scoped>

.blocklyFieldRect:hover {
    stroke: white;
    stroke-width: 2px;
}

</style>

<script setup lang="ts">
import { ref } from 'vue';


const menuOpen = ref(false);

const props = defineProps(["source", "blockData", "cache"]);

const emit = defineEmits<{
    (e: "stageUndo", value: any): void
}>();
</script>