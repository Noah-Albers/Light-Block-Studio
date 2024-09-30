import { $t, SupportedLanguagesType } from "@localisation/Fluent";
import { ExportedGlobalPlainSettings, GlobalSettingsSchema } from "./GlobalSettingsSchema";
import { useSettingsStore, View } from "@webapp/stores/SettingsStore";
import DesktopApi from "@webapp/desktopapi/DesktopApi";

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

        // TODO: Change alert/confirm to web-based interface
        const baseString = $t('global_settings_import_error_unknown');

        if(DesktopApi.isDesktop()){
            if(!confirm(baseString + $t('global_settings_import_error_unknown_question-desktop'))){
                DesktopApi.closeWindow();
                return;
            }
        }else
            alert(
                baseString+
                $t('global_settings_import_error_unknown_question-browser')
            )


        store.restoreDefaults();
        return;
    }

    // 1. Imports the plain settings
    importPlainSettings(res.data.plainSettings);
}
