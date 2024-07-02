import { defineStore } from 'pinia'

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

export const useSettingsStore = defineStore('settings', {
    state: () => ({

        // Which view is selected
        mainView: ViewVisualizer as Views,

        // Settings for the serial preview
        serialPreview: {
            pin: 0 as number,
            ledAmount: 16 as number,
        },

        // Settings for whitelisting USB-Vendors
        whitelistUsbVendors: {
            // If the whitelist should be enabled
            enabled: true as boolean,
            // Which vendors are whitelisted
            whitelist: DefaultVendors.map(itm=>[itm[0], itm[1]]) as [string/*Name*/, number/*VendorID*/][]
        },

        buildConfig: {
            enablePreview: false as boolean
        }
    }),

    actions: {

        restoreVendorDefaults(){
            return this.whitelistUsbVendors.whitelist = DefaultVendors.map(itm=>[itm[0], itm[1]]);
        },

        addVendor(name: string, id: number){
            this.whitelistUsbVendors.whitelist.push([name, id]);
        },

        removeVendor(id: number){
            this.whitelistUsbVendors.whitelist = this.whitelistUsbVendors.whitelist.filter(itm=>itm[1] !== id)
        },

        doesVendorIDExist(id: number) : boolean {
            return this.whitelistUsbVendors.whitelist.some(itm=>itm[1] === id);
        }
    }
})
