import { $t } from "@localisation/Fluent";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { exportProject } from "@webapp/storage/project/ProjectExporter";
import { importProject } from "@webapp/storage/project/ProjectImporter";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";
import Branding from "../../../../Branding";

// Event: When the user clicks on save or save-as
async function onSaveProject(action: "save" | "saveas"){
    const proj = useProjectStore();

    // Check if a path is required
    const requirePath = action === "saveas" || proj.filePath === undefined;

    // Gets the path
    const path = requirePath ? DesktopApi.saveDialog($t('storage-desktop_save_title'), proj.filePath) : proj.filePath;

    // Checks if the action was aborted
    if(path === undefined) return;

    // Saves the file
    const res = DesktopApi.writeFile(path, JSON.stringify(await exportProject()));

    // Checks for errors
    if(res !== true){
        SignalDispatcher.emit(Signals.DISPLAY_POPUP,{
            message: $t('storage-desktop_save_error', { EXT: Branding.FILE_EXTENSION }),
            no: $t('storage-desktop_save_error_no'),
            yes: $t('storage-desktop_save_error_yes'),
            onResolve(yesOrNo) {
                if(yesOrNo === "yes")
                    onSaveProject(action)
            },
        });
        return;
    }

    // Adds the path to the known paths
    useSettingsStore().addRecentProject(path);
}

// Event: Called when a file is choosen and need to be loaded
async function onProjectChoosen(path: string) {
    
    // Tries to read the file
    const readFile = DesktopApi.readFile(path);

    if (readFile === undefined) {
        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            type: "error",
            timeout: 5000,
            text: $t('storage-desktop_load_error', { EXT: Branding.FILE_EXTENSION })
        });
        return;
    }

    // Gets the filename
    const fileName = DesktopApi.pathBasename(path)

    const res = await importProject(fileName, readFile, (msg, btnTrue, btnFalse) => {

        return new Promise((res) => {
            SignalDispatcher.emit(Signals.DISPLAY_POPUP, {
                message: msg,
                no: btnFalse,
                yes: btnTrue,
                onResolve: (a) => res(a == "yes")
            });
        });
    }, path);

    if (res.success) {
        // Updates recently-opened projects
        useSettingsStore().addRecentProject(path);
        return;
    }

    if (res.message !== undefined)
        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            type: "error",
            timeout: 5000,
            text: $t('storage_error_failedtoload')
        });

    console.warn("Failed to load Project", res.message);
}

// Event: When the open project button is clicked
function onOpenClicked() {
    const openResult = DesktopApi.openDialog($t('storage-desktop_load_title'));

    if (openResult === undefined) return;

    onProjectChoosen(openResult);
}

/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createDesktopStorageMenuItems() {

    const settings = useSettingsStore();

    // Open (Upload File)
    const buttonOpenFile: Button = {
        text: $t('taskbar_storage-desktop_open'), action: onOpenClicked,
        title: $t('taskbar_storage-desktop_open_title'), icon: "mdi-file-document-edit-outline",
    };

    // Open recent projects
    const menuOpenFromBrowser: Menu = {
        items: () => settings.recentProjectPaths.map(x => ({
            text: x,
            action: ()=>onProjectChoosen(x),
            title: $t('taskbar_storage-desktop_recent_item_title')
        }) as Button),
        text: $t('taskbar_storage-desktop_recent'),
        disabled: useSettingsStore().recentProjectPaths.length <= 0,
        icon: "mdi-history",
        title: $t('taskbar_storage-desktop_recent_title')
    }

    // Save project
    const saveButton: Button = {
        text: $t('taskbar_storage-desktop_save'), action: () => onSaveProject("save"),
        title: $t('taskbar_storage-desktop_save_title'), icon: "mdi-content-save-outline"
    };

    // Save project as
    const saveAsButton: Button = {
        text: $t('taskbar_storage-desktop_saveas'), action: () => onSaveProject("saveas"),
        title: $t('taskbar_storage-desktop_saveas_title'), icon: "mdi-content-save-all-outline"
    };

    return {
        create: [
            buttonOpenFile,
            menuOpenFromBrowser,
        ],
        save: [
            saveButton,
            saveAsButton
        ]
    }

}