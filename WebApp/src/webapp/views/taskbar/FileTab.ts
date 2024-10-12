import { Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { $t } from "@localisation/Fluent";
import { createTemplateSubTab } from "./filetab/TemplatesSubtab";
import { createLEDApiSubTab } from "./filetab/LEDAPISubtab";
import { createStorageMenuItems } from "./filetab/StorageSubtab";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import PlatformUtils from "@webapp/utils/PlatformUtils";

export const createFileTab : ()=>Menu = ()=>{
    
    const storageItems = createStorageMenuItems();

    const newItem = {
        text: $t("tab_file_new"),
        action: ()=> PlatformUtils.openNewWindow(),
        icon: "mdi-plus"
    } as MenuItem;

    const openSettings = {
        text: $t('tab_file_settings'),
        action() { SignalDispatcher.emit(Signals.OPEN_SETTINGS) },
        icon: "mdi-cog"
    }
    
    return {
        text: $t('tab_file'),
        items: ()=>[
            newItem,
            "seperator",
            ...storageItems.create,
            "seperator",
            ...storageItems.save,
            "seperator",
            ...storageItems.delete,
            ...(storageItems.delete.length > 0 ? [
                "seperator" as const
            ] : []),
            openSettings,
            "seperator",
            createTemplateSubTab(),
            createLEDApiSubTab()
    
        ]
    } 
}