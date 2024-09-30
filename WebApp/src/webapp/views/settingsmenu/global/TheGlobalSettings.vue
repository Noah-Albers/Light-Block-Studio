<template>
    <v-browser v-if="!isLocalstorageSupported()">
        <v-alert
            density="compact" variant="tonal" class="ma-3" type="warning"
            :text="$t('globalsettings_error_ls-not-supported')"
        ></v-alert>
    </v-browser>
    <div class="d-flex flex-row">
        <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-application-cog-outline" :text="$t('globalsettings_category_general')"
                value="general"></v-tab>
            <v-tab prepend-icon="mdi-usb" :text="$t('globalsettings_category_serial')" value="serial"></v-tab>

        </v-tabs>

        <v-window v-model="tab" style="padding: 20px; width: 100%; height: 100%; overflow: auto;">
            <v-window-item value="general">
                <TheGeneralSettings />
            </v-window-item>
            <v-window-item value="serial">
                <TheSerialSettings />
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup
    lang="ts">
    import { ref } from 'vue';
    import TheSerialSettings from "./TheSerialSettings.vue"
    import TheGeneralSettings from './TheGeneralSettings.vue';

    import { isLocalstorageSupported } from "@utils/Localstorage";

    const tab = ref();

    </script>