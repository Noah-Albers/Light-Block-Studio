<template>

    <div class="d-flex flex-row" style="height: 100%;">
        <v-tabs v-model="tab"
            color="primary"
            direction="vertical">
            <v-tab prepend-icon="mdi-cog"
                :text="$t('projectsettings_category_general')"
                value="general"></v-tab>
            <v-tab prepend-icon="mdi-hook"
                :text="$t('projectsettings_category_hooks')"
                value="hook"></v-tab>
            <v-tab prepend-icon="mdi-text-box"
                :text="$t('projectsettings_category_blueprint')"
                value="codePreset"></v-tab>
            <v-tab prepend-icon="mdi-led-outline"
                :text="$t('projectsettings_category_ledapi')"
                value="ledapi"></v-tab>
        </v-tabs>

        <v-window v-model="tab" style="padding: 20px; width: 100%; height: 100%; overflow: auto;">
            <v-window-item value="general">
                <TheGlobalSettings/>
            </v-window-item>

            <v-window-item value="hook">
                <TheHookSettings/>
            </v-window-item>

            <v-window-item value="codePreset">
                <TheProjectCodePresetSettings/>
            </v-window-item>
            <v-window-item value="ledapi">
                <TheProjectLEDHookSettings/>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup
    lang="ts">
    import TheHookSettings from "./TheProjectHookSettings.vue";
    import TheGlobalSettings from "./TheProjectGlobalSettings.vue";
    import { ref } from 'vue';
    import TheProjectLEDHookSettings from "./TheProjectLEDHookSettings.vue";
import TheProjectCodePresetSettings from "./TheProjectCodePresetSettings.vue";

    const tab = ref();

</script>