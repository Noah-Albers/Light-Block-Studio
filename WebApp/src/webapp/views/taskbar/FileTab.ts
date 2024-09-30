import { Menu } from "@webapp/utils/taskbar/TaskBar";
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
    
    return {
        text: $t('tab_file'),
        items: ()=>[
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