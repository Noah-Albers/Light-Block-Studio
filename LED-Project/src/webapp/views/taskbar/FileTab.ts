import { createBrowserStorageMenuItems } from "@webapp/storage/browser/BrowserStorage";
import { Menu } from "@webapp/utils/taskbar/TaskBar";
import { $t } from "@localisation/Fluent";
import { createTemplateSubTab } from "./filetab/TemplatesSubtab";

export const createFileTab : ()=>Menu = ()=>({ 
    text: $t('tab_file'),
    items: ()=>[
        ...createBrowserStorageMenuItems(),
        "seperator",
        createTemplateSubTab()
    ]
})