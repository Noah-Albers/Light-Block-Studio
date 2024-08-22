import { Menu } from "@webapp/utils/taskbar/TaskBar";
import { $t } from "@localisation/Fluent";
import { createTemplateSubTab } from "./filetab/TemplatesSubtab";
import { createBrowserStorageMenuItems } from "@webapp/storage/project/browser/ProjectBrowserStorage";
import { createLEDApiSubTab } from "./filetab/LEDAPISubtab";

export const createFileTab : ()=>Menu = ()=>({ 
    text: $t('tab_file'),
    items: ()=>[
        ...createBrowserStorageMenuItems(),
        "seperator",
        createTemplateSubTab(),
        createLEDApiSubTab()

    ]
})