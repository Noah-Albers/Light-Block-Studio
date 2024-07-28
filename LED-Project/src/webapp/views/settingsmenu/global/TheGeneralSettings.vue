<template>
    <v-checkbox :label="$t('globalsettings_general_specific_config')"
        v-tooltip="$t('globalsettings_general_specific_config-tooltip')"
        v-model="store.buildConfig.enablePreview"></v-checkbox>

    <v-select
        :lable="$t('globalsettings_general_language')"
        v-tooltip="$t('globalsettings_general_language-tooltip')"
        chips
        v-model="store.language"
        item-title="name"
        item-value="value"
        :items="[{value: 'de', name: 'German'}, {value:'en', name: 'English'}]"
        variant="outlined"></v-select>
</template>
    
<script setup
    lang="ts">

    import { useSettingsStore } from '@webapp/stores/SettingsStore';

    const store = useSettingsStore();

</script>