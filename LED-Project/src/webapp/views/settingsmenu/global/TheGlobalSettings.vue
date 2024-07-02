<template>
    <div class="d-flex flex-row" style="height: 100%;">
        <v-tabs v-model="tab" bg-color="#f3f3f3" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-application-cog-outline" text="General" value="general"></v-tab>
            <v-tab prepend-icon="mdi-usb" text="Serial API" value="serial"></v-tab>

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

    const tab = ref();

    </script>