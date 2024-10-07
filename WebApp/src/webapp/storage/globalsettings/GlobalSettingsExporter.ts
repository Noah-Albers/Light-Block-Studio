import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { ExportedGlobalPlainSettings, ExportedGlobalSettingsType } from "./GlobalSettingsSchema";

// Exports the plain settings
function getPlainSettings() : ExportedGlobalPlainSettings{
    const store = useSettingsStore();

    return {
        buildConfig: {
            enablePreview: store.buildConfig.enablePreview
        },
        isDeveloper: store.isDeveloper,
        language: store.language,
        mainView: store.mainView,
        serialPreview: {
            ledAmount: store.serialPreview.ledAmount,
            pin: store.serialPreview.pin
        },
        usbVendorsWhitelist: {
            enabled: store.whitelistUsbVendors.enabled,
            whitelist: store.whitelistUsbVendors.whitelist
        },
        recentProjectPaths: store.recentProjectPaths,
        defaultPreview: store.defaultPreview,
        preventPWAInstallAd: store.preventPWAInstallAd,
    }
}


// Exports the global config as a json-serializable object.
// Can be loaded again using the global settings importer
export function exportGlobalSettings(): ExportedGlobalSettingsType {
    return {
        plainSettings: getPlainSettings()

        // Here is space for more specific global settings (If required at some point)
    }
}