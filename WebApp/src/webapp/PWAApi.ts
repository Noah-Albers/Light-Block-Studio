import { ref } from "vue";
import { useSettingsStore } from "./stores/SettingsStore";


type PromptType = ()=>Promise<{ outcome: "dismissed"|"accepted" }>;

// If the popup with the install-pwa-add is dismissed and shall not show
const isDismissed = ref(true);

// If the app is installable as a pwa
const isInstallable = ref(false);

//#region API-Communication
// Holds the action to prompt the user with the install window
// Might be undefined if recently used or the app is not installable
let promptHandler: {prompt: PromptType}|undefined;
function onEvent(evt: { prompt: PromptType }){
    promptHandler = evt;
    isInstallable.value = true;

    if(!useSettingsStore().preventPWAInstallAd)
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
    isInstallable.value = false;
    promptHandler = undefined;

    return req;
}

// Dismisses the in-app prompt to install the app
function dismissBanner(dontShowAgain: boolean = false){
    console.log("DontShowAgain: ",dontShowAgain)
    isDismissed.value = true;

    if(dontShowAgain)
        useSettingsStore().preventPWAInstallAd = true;
}

// Called when the app starts up
function setup(){
    window.addEventListener("beforeinstallprompt", onEvent as any);
}

export default {
    isDismissed,
    isInstallable,
    setup,
    prompt,
    dismissBanner
}