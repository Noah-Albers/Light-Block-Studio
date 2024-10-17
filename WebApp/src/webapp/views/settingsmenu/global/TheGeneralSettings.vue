<template>
    <v-checkbox :label="$t('globalsettings_general_specific_config')"
        v-tooltip="$t('globalsettings_general_specific_config-tooltip')"
        v-model="store.buildConfig.enablePreview"></v-checkbox>

    <v-select
        :label="$t('globalsettings_general_language')"
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

    <!-- Switch default preview for new projects -->
    <p class="text-h5 mb-2">{{ $t('globalsettings_general_defaultPreview') }}</p>
    <v-overlay class="align-center justify-center">
        <template #activator="{ props }">
            
            <PreviewRenderer style="display: inline-block" :downloadable="false" :preview="store.defaultPreview">
                <v-icon class="mr-4" icon="mdi-open-in-new" v-bind="props"
                    v-tooltip="$t('globalsettings_general_defaultPreview-tooltip')"/>
            </PreviewRenderer>
        </template>

        <PreviewPicker buildin-only v-model="store.defaultPreview" />
    </v-overlay>
</template>
    
<script setup
    lang="ts">

    import { useSettingsStore } from '@webapp/stores/SettingsStore';
    import { $t, SupportedLanguages } from "@localisation/Fluent"
    import PreviewPicker from "@webapp/widgets/previewpicker/PreviewPicker.vue";
    import PreviewRenderer from "@webapp/widgets/previewpicker/PreviewRenderer.vue";

    const store = useSettingsStore();

</script>