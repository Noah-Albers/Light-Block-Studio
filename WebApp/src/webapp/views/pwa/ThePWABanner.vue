<template>
<!--Advertisement to install the app as a PWA-->
<v-app-bar v-if="!PWAApi.isDismissed.value" color="info" :elevation="1" height="35">
    <v-spacer/>
    <p class="mr-3 text-subtitle-1">
        {{ $t('pwa_notice') }}
    </p>

    <v-btn icon="mdi-help-circle-outline" color="#eeee00" density="comfortable" v-tooltip="$t('pwa_information')"></v-btn>
    <v-btn @click="PWAApi.prompt()" icon="mdi-download-circle-outline" color="#00ee00" density="comfortable" v-tooltip="$t('pwa_install')"></v-btn>
    <v-btn @click="PWAApi.dismissBanner(true)" icon="mdi-close-circle-outline" density="comfortable" v-tooltip="$t('pwa_close_temp')"></v-btn>
    <v-spacer/>

    <v-btn @click="PWAApi.dismissBanner()" icon="mdi-close" density="comfortable" color="#ee0000" v-tooltip="$t('pwa_close_final')"></v-btn>
</v-app-bar>
</template>


<script setup lang="ts">
import PWAApi from "@webapp/PWAApi";

</script>