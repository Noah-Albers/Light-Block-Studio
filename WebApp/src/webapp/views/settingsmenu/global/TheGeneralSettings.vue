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
        item-value="key"
        :items="SupportedLanguages"
        variant="outlined"></v-select>
        <v-alert
            icon="mdi-info"
            :text="$t('globalsettings_general_language-info')"
            type="info"
            variant="tonal"
            ></v-alert>

    <v-checkbox :label="$t('globalsettings_general_isDeveloper')"
        v-tooltip="$t('globalsettings_general_isDeveloper-tooltip')"
        v-model="store.isDeveloper"></v-checkbox>
</template>
    
<script setup
    lang="ts">

    import { useSettingsStore } from '@webapp/stores/SettingsStore';
    import { computed } from "vue";
    import { $t, SupportedLanguages } from "@localisation/Fluent"

    const store = useSettingsStore();

</script>