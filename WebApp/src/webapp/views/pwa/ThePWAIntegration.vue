<template>
<!--Advertisement to install the app as a PWA-->
<v-app-bar v-if="!isDismissed" color="info" :elevation="1" height="35">
    <v-spacer/>
    <p class="mr-3 text-subtitle-1">
        {{ $t('pwa_notice') }}
    </p>

    <v-btn icon="mdi-help-circle-outline" color="#eeee00" density="comfortable" v-tooltip="$t('pwa_information')"></v-btn>
    <v-btn @click="prompt" icon="mdi-download-circle-outline" color="#00ee00" density="comfortable" v-tooltip="$t('pwa_install')"></v-btn>
    <v-btn @click="dismissBanner(true)" icon="mdi-close-circle-outline" density="comfortable" v-tooltip="$t('pwa_close_temp')"></v-btn>
    <v-spacer/>

    <v-btn @click="dismissBanner()" icon="mdi-close" density="comfortable" color="#ee0000" v-tooltip="$t('pwa_close_final')"></v-btn>
</v-app-bar>
</template>


<script setup lang="ts">

import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { onMounted, ref } from "vue"

type PromptType = ()=>Promise<{ outcome: "dismissed"|"accepted" }>;

const settings = useSettingsStore();

// If the popup with the install-pwa-add is dismissed and shall not show
const isDismissed = ref(true);

//#region API-Communication
// Holds the action to prompt the user with the install window
// Might be undefined if recently used or the app is not installable
let promptHandler: {prompt: PromptType}|undefined;
function onEvent(evt: { prompt: PromptType }){
    promptHandler = evt;

    if(!settings.preventPWAInstallAd)
        isDismissed.value = false;
}
//#endregion


// Prompts the user to install the app (If installable)
function prompt(){
    if(promptHandler === undefined) {
        console.log("Prompt-handler was undefined (The app is not installable?)");
        return;
    }

    // Requests the user to install the app
    const req = promptHandler.prompt();
    // Reset
    isDismissed.value = true;
    promptHandler = undefined;

    return req;
}

// Dismisses the in-app prompt to install the app
function dismissBanner(dontShowAgain: boolean = false){
    console.log("DontShowAgain: ",dontShowAgain)
    isDismissed.value = true;

    if(dontShowAgain)
        settings.preventPWAInstallAd = true;
}

onMounted(()=>{
    window.addEventListener("beforeinstallprompt", onEvent as any);
});

</script>