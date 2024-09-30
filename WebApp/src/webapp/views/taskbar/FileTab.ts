import { Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { $t } from "@localisation/Fluent";
import { createTemplateSubTab } from "./filetab/TemplatesSubtab";
import { createLEDApiSubTab } from "./filetab/LEDAPISubtab";
import { createBrowserStorageMenuItems } from "./filetab/BrowserStorageSubtab";
import { createDesktopStorageMenuItems } from "./filetab/DesktopStorageSubtab";
import DesktopApi from "@webapp/desktopapi/DesktopApi";

export const createFileTab : ()=>Menu = ()=>{
    
    const browserItems = !DesktopApi.isDesktop() ? createBrowserStorageMenuItems() : {
        create: [],
        save: [],
        delete: []
    };
    const desktopItems = DesktopApi.isDesktop() ? createDesktopStorageMenuItems() : {
        create: [],
        save: []
    };

    const newItem = {
        text: $t("tab_file_new"),
        action() {
            if(DesktopApi.isDesktop())
                DesktopApi.openNewWindow();
            else
                window.open(window.location.toString(), '_blank');
        },
        icon: "mdi-plus"
    } as MenuItem;
    
    return {
        text: $t('tab_file'),
        items: ()=>[
            newItem,
            ...browserItems.create,
            ...desktopItems.create,
            "seperator",
            ...browserItems.save,
            ...desktopItems.save,
            "seperator",
            ...browserItems.delete,
            ...(browserItems.delete.length > 0 ? [
                "seperator" as const
            ] : []),
            createTemplateSubTab(),
            createLEDApiSubTab()
    
        ]
    } 
}