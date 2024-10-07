import { $t, SupportedLanguagesType } from "@localisation/Fluent";
import { ExportedGlobalPlainSettings, GlobalSettingsSchema } from "./GlobalSettingsSchema";
import { useSettingsStore, View } from "@webapp/stores/SettingsStore";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import GlobalSettingsManager from "./GlobalSettingsManager";

function importPlainSettings(data: ExportedGlobalPlainSettings){

    const store = useSettingsStore();

    store.buildConfig.enablePreview = data.buildConfig.enablePreview;
    store.isDeveloper = data.isDeveloper
    store.language = data.language as SupportedLanguagesType;
    store.mainView = data.mainView as View,
    store.serialPreview.ledAmount = data.serialPreview.ledAmount;
    store.serialPreview.pin = data.serialPreview.pin;
    store.whitelistUsbVendors.enabled = data.usbVendorsWhitelist.enabled;
    store.whitelistUsbVendors.whitelist = data.usbVendorsWhitelist.whitelist;
    store.defaultPreview = data.defaultPreview;
    store.recentProjectPaths = data.recentProjectPaths
    store.preventPWAInstallAd = data.preventPWAInstallAd;
}

// Imports the global settings
export function importGlobalsettings(raw: unknown) {

    const store = useSettingsStore();

    if(typeof raw === "string"){
        try{
            raw = JSON.parse(raw);
        }catch(err){
            console.error("Failed to load global settings:",err);
            raw = {};
        }
    }else
        raw = {};

    // Tries to import the project
    var res = GlobalSettingsSchema.safeParse(raw);
    if(!res.success){
        // Note: This should never really happen, except if something went really wrong.

        // Error logs
        console.error("Error-Log",res.error.issues,res.data, raw);

        // !Note!: At this point in time fluent has not been registered. Therefor we can only show english errors here.

        const baseString = 'Failed to load the application settings.\nIf you proceed, your old settings will be lost.\n';

        if(DesktopApi.isDesktop()){
            if(!confirm(baseString + "Do you want to proceed?")){
                DesktopApi.closeWindow();
                return;
            }
        }else
            alert(
                baseString+
                "If you dont want that to happen, close the webpage now.\n\nDo you want to proceed?"
            )

        store.restoreDefaults();

        GlobalSettingsManager.requestSave();
        return;
    }

    // 1. Imports the plain settings
    importPlainSettings(res.data.plainSettings);
}
