<template>
    <v-checkbox label="Specify config for selected?"
        v-tooltip="'If a block is selected, only the config for this block shall be build.'"
        v-model="store.buildConfig.enablePreview"></v-checkbox>
</template>
    
<script setup
    lang="ts">

    import { useSettingsStore } from '@webapp/stores/SettingsStore';

    const store = useSettingsStore();

    </script>