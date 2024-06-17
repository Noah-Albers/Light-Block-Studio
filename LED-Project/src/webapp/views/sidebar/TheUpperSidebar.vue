<template>
    <TheVisualizer v-if="store.mainView === ViewVisualizer"/>
    <TheCodeView v-else-if="store.mainView === ViewCode"/>
    <TheSerialPreview v-else-if="store.mainView === ViewSerial"/>
</template>

<script setup lang="ts">
import TheVisualizer from "@webapp/views/visualizer/TheVisualizer.vue";
import TheCodeView from "@webapp/views/codeview/TheCodeView.vue";
import TheSerialPreview from "@webapp/views/serialpreview/TheSerialPreview.vue";
import { useSettingsStore, ViewCode, ViewSerial, ViewVisualizer } from '@webapp/stores/SettingsStore';

const store = useSettingsStore();

</script>