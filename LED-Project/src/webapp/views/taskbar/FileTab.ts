import { createBrowserStorageMenuItems } from "@webapp/storage/browser/BrowserStorage";
import { Menu } from "@webapp/utils/taskbar/TaskBar";
import { TemplatesSubTab } from "./filetab/TemplatesSubtab";

export const FileTab: Menu = {
    text: "File",
    items: [
        ...createBrowserStorageMenuItems(),
        "seperator",
        TemplatesSubTab
    ]
}