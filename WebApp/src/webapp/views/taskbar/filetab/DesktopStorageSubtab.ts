
// TODO: Lang

import { $t } from "@localisation/Fluent";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { exportProject } from "@webapp/storage/project/ProjectExporter";
import { importProject } from "@webapp/storage/project/ProjectImporter";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

// Event: When the user clicks on save or save-as
async function onSaveProject(action: "save" | "saveas"){
    const proj = useProjectStore();

    // Check if a path is required
    const requirePath = action === "saveas" || proj.filePath === undefined;

    // Gets the path
    const path = requirePath ? DesktopApi.saveDialog("Save Project", proj.filePath) : proj.filePath;

    // Checks if the action was aborted
    if(path === undefined) return;

    // Saves the file
    const res = DesktopApi.writeFile(path, JSON.stringify(await exportProject()));

    // Checks for errors
    if(res !== true){
        SignalDispatcher.emit(Signals.DISPLAY_POPUP,{
            message: "Failed to save the project. Did your file-extension end in .json? This is required as a security measure. Do you want to retry?",
            no: "No",
            yes: "Yes",
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
            text: "Failed to read project file. Please make sure it exists and that is's name ends with '.json'"
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
    const openResult = DesktopApi.openDialog("Open Project");

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
        text: "Open", action: onOpenClicked,
        title: "Open a project-file", icon: "mdi-file-document-edit-outline",
    };

    // Open recent projects
    const menuOpenFromBrowser: Menu = {
        items: () => settings.recentProjectPaths.map(x => ({
            text: x,
            action: ()=>onProjectChoosen(x),
            title: "Load this project"
        }) as Button),
        text: "Open recent",
        disabled: useSettingsStore().recentProjectPaths.length <= 0,
        icon: "mdi-history",
        title: "Open a recently saved project file"
    }

    // Save project
    const saveButton: Button = {
        text: "Save", action: () => onSaveProject("save"),
        title: "Save the project as a file", icon: "mdi-content-save-outline"
    };

    // Save project as
    const saveAsButton: Button = {
        text: "Save as...", action: () => onSaveProject("saveas"),
        title: "Save the project into a file you select", icon: "mdi-content-save-all-outline"
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