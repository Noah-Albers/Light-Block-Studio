import { createBrowserStorageMenuItems } from "@webapp/storage/browser/BrowserStorage";
import { Menu } from "@webapp/utils/taskbar/TaskBar";

export const FileTab: Menu = {
    text: "File",
    items: [
        ...createBrowserStorageMenuItems(),
    ]
}