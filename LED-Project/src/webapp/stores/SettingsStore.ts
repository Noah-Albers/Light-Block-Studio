import { changeLanguage } from '@localisation/Fluent';
import { defineStore } from 'pinia'
import { reactive, ref, watch, watchEffect } from 'vue';

type View = { icon: string };
type Views = keyof typeof MainViews

export const ViewVisualizer = "Visualizer";
export const ViewCode = "Code";
export const ViewSerial = "Serial Preview";

export const MainViews: {[key: string]: View} = {
    [ViewCode]: { icon: "mdi-code-tags" },
    [ViewVisualizer]: { icon: "mdi-play-box-outline" },
    [ViewSerial]: { icon: "mdi-usb" }
}

export const DefaultVendors: [string, number][] = [
    ["Arduino", 0x2341],
    ["EspressIF", 0x303A]
]

export const useSettingsStore = defineStore('settings', () => {

    //#region Language

    // Which language is selected
    const language = ref(undefined as any as "en" | "de");

    // Ensures the language change is reflected
    watchEffect(()=>changeLanguage(language.value));

    // Sets the default language
    language.value = "de";
    //#endregion

    //#region Settings


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
        mainView, serialPreview, whitelistUsbVendors, buildConfig, language,

        restoreVendorDefaults, addVendor, removeVendor, doesVendorIDExist
    };
});