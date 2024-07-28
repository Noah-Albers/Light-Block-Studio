import { $t, SupportedLanguages } from '@localisation/Fluent';
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';

// Note: The function to the translation key is so that it isn't initialized until needed (Prevents wrong and invalid translations)
type View = { icon: string, name: ()=>string };
type Views = keyof typeof MainViews

export const ViewVisualizer = "visualizer";
export const ViewCode = "code";
export const ViewSerial = "serial";

export const MainViews: {[key: string]: View} = {
    [ViewCode]: { icon: "mdi-code-tags", name: ()=>$t('view_code_name') },
    [ViewVisualizer]: { icon: "mdi-play-box-outline", name: ()=>$t("view_visualizer_name") },
    [ViewSerial]: { icon: "mdi-usb", name: ()=>$t('view_serial_name') }
}

export const DefaultVendors: [string, number][] = [
    ["Arduino", 0x2341],
    ["EspressIF", 0x303A]
]

export const useSettingsStore = defineStore('settings', () => {

    //#region Language

    // Which language is selected
    const language = ref("de" as any as SupportedLanguages);
    //#endregion

    //#region Settings

    // If the developermode is enabled
    // TODO: Change when fully packaged
    const isDeveloper = ref(true);

    // Which view is selected
    const mainView = ref(ViewVisualizer as Views);

    // Settings for the serial preview
    const serialPreview = reactive({
        pin: 0 as number,
        ledAmount: 16 as number,
    });

    // Settings for whitelisting USB-Vendors
    const whitelistUsbVendors = reactive({
        // If the whitelist should be enabled
        enabled: true as boolean,
        // Which vendors are whitelisted
        whitelist: DefaultVendors.map(itm => [itm[0], itm[1]]) as [string/*Name*/, number/*VendorID*/][]
    });

    const buildConfig = reactive({
        enablePreview: false as boolean
    });

    //#endregion

    //#region USB-Actions

    // Restore the default vendor list
    function restoreVendorDefaults() {
        whitelistUsbVendors.whitelist = DefaultVendors.map(itm => [itm[0], itm[1]]);
    }

    // Add a vendor to the whitelist
    function addVendor(name: string, id: number) {
        whitelistUsbVendors.whitelist.push([name, id]);
    }

    // Remove a vendor from the whitelist
    function removeVendor(id: number) {
        whitelistUsbVendors.whitelist = whitelistUsbVendors.whitelist.filter(itm => itm[1] !== id);
    }

    // Check if a vendor ID exists in the whitelist
    function doesVendorIDExist(id: number): boolean {
        return whitelistUsbVendors.whitelist.some(itm => itm[1] === id);
    }

    //#endregion

    return {
        mainView, serialPreview, whitelistUsbVendors, buildConfig, language, isDeveloper,

        restoreVendorDefaults, addVendor, removeVendor, doesVendorIDExist
    };
});