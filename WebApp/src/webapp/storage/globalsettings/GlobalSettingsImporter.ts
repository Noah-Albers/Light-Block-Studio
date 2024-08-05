import { $t, SupportedLanguagesType } from "@localisation/Fluent";
import { ExportedGlobalPlainSettings, GlobalSettingsSchema } from "./GlobalSettingsSchema";
import { useSettingsStore, View } from "@webapp/stores/SettingsStore";

// TODO: Add language lookups
// TODO: Implement browser vs desktop check to automatically safe the global settings

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
}

// Imports the global settings
export function importGlobalsettings(raw: unknown) {

    const store = useSettingsStore();

    if(typeof raw === "string"){
        try{
            raw = JSON.parse(raw);
        }catch(err){
            console.error("Failed to load global settings:",err);
        }
    }

    // Tries to import the project
    var res = GlobalSettingsSchema.safeParse(raw);
    if(!res.success){
        // Note: This should never really happen except something really went wrong.

        // TODO: Implement some browser vs desktop check to close the app
        
        // Informs the user of the error and informs him to leave if his settings are broken.
        alert("Failed to load the application settings.\nIf you proceed your old settings will be lost. If you dont want that to happen, close the webpage now.\n\nDo you want to proceed?");

        store.restoreDefaults();
        return;
    }

    // 1. Imports the plain settings
    importPlainSettings(res.data.plainSettings);
}
