<template>
    <TheVisualizer v-if="store.mainView === ViewVisualizer"/>
    <TheCodeView v-else-if="store.mainView === ViewCode"/>
</template>

<script setup lang="ts">
import TheVisualizer from "@webapp/views/visualizer/TheVisualizer.vue";
import TheCodeView from "@webapp/views/codeview/TheCodeView.vue";
import { useSettingsStore, ViewCode, ViewVisualizer } from '@webapp/stores/SettingsStore';

const store = useSettingsStore();

</script>