import { $t, SupportedLanguagesType } from "@localisation/Fluent";
import { ExportedGlobalPlainSettings, GlobalSettingsSchema } from "./GlobalSettingsSchema";
import { useSettingsStore, View } from "@webapp/stores/SettingsStore";
import DesktopApi from "@webapp/desktopapi/DesktopApi";

// TODO: Add language lookups

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
        // Note: This should never really happen, except if something went really wrong.

        // Error logs
        console.error(res.error.issues,res.data, raw);

        // TODO: Translate and change alert/confirm to web-based interface
        const baseString = (
            `Failed to load the application settings.\n`+
            `If you proceed, your old settings will be lost.\n`
        );

        if(DesktopApi.isDesktop()){
            if(!confirm(baseString + `Do you want to proceed?`)){
                DesktopApi.closeWindow();
                return;
            }
        }else
            alert(
                baseString+
                `If you dont want that to happen, close the webpage now.\n\n`+
                `Do you want to proceed?"`
            )


        store.restoreDefaults();
        return;
    }

    // 1. Imports the plain settings
    importPlainSettings(res.data.plainSettings);
}
