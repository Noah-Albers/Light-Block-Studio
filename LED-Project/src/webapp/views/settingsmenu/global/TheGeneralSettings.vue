<template>
    <v-checkbox label="Specify config for selected?"
        v-tooltip="'If a block is selected, only the config for this block shall be build.'"
        v-model="store.buildConfig.enablePreview"></v-checkbox>

    <v-select
        v-tooltip="'Which language to use for the application'"
        chips
        v-model="store.language"
        item-title="name"
        item-value="value"
        label="Language" :items="[{value: 'de', name: 'German'}, {value:'en', name: 'English'}]"
        variant="outlined"></v-select>
</template>
    
<script setup
    lang="ts">

    import { useSettingsStore } from '@webapp/stores/SettingsStore';

    const store = useSettingsStore();

    </script>