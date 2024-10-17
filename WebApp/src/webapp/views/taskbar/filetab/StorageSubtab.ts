import { C } from "@webapp/utils/html/HTMLBuilder";
import { Button, Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { $t } from "@localisation/Fluent";
import { exportProject } from "../../../storage/project/ProjectExporter";
import { importProject } from "../../../storage/project/ProjectImporter";
import { isLocalstorageSupported } from "@utils/Localstorage";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import Branding from "../../../../Branding";
import ImportExportUi from "@webapp/storage/ImportExportUi";
import DesktopApi from "@webapp/desktopapi/DesktopApi";



/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createStorageMenuItems() {
    
    if(DesktopApi.isDesktop())
        return createDesktopStorageMenuItems();

    const lsItms = createLocalstorageItems();
    const browserItms = ImportExportUi.isFileApiSupported() ? createFileApiItems() : createLagacyItems();

    return {
        create: [
            ...lsItms.create,
            ...browserItms.create,
        ],
        save: [
            ...lsItms.save,
            ...browserItms.save
        ],
        delete: [
            ...lsItms.delete
        ]
    }

}


/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createDesktopStorageMenuItems() {

    // Open (Upload File)
    const buttonOpenFile: Button = {
        text: $t('taskbar_storage-desktop_open'), action: ImportExportUi.desktop.openDialog,
        title: $t('taskbar_storage-desktop_open_title'), icon: "mdi-file-document-edit-outline",
    };

    // Open recent projects
    const recentProjects = ImportExportUi.desktop.recentProjects();
    const menuOpenFromBrowser: Menu = {
        items: () => recentProjects.map(x => ({
            text: x,
            action: ()=>ImportExportUi.desktop.openProject(x),
            title: $t('taskbar_storage-desktop_recent_item_title')
        }) as Button),
        text: $t('taskbar_storage-desktop_recent'),
        disabled: recentProjects.length <= 0,
        icon: "mdi-history",
        title: $t('taskbar_storage-desktop_recent_title')
    }

    // Save project
    const saveButton: Button = {
        text: $t('taskbar_storage-desktop_save'), action: () => ImportExportUi.desktop.save("save"),
        title: $t('taskbar_storage-desktop_save_title'), icon: "mdi-content-save-outline"
    };

    // Save project as
    const saveAsButton: Button = {
        text: $t('taskbar_storage-desktop_saveas'), action: () => ImportExportUi.desktop.save("saveas"),
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
        ],
        delete: []
    }
}

// Creates the items used to access the browsers localstorage items
function createLocalstorageItems() {
    function createLocalstorageButton(text: string, type: "action" | "items", value: () => any, icon?: string): Button | Menu {
        if (isLocalstorageSupported())
            return {
                [type]: value(),
                text,
                icon
            } as any as Button | Menu;
        return {
            [type]: () => [],
            text,
            icon,
            title: $t('storage_error_notsupported')
        } as any as Button | Menu
    }


    // Menu to open a project from browser storage
    const menuOpenFromBrowser: Menu = createLocalstorageButton(
        $t('taskbar_storage_openbrowser'), "items", () => createLocalstorageMenu(true),
        "mdi-open-in-app"
    ) as Menu;

    // Menu to delete a project from browser storage
    const menuDeleteFromBrowser: Menu = createLocalstorageButton(
        $t('taskbar_storage_deletebrowser'), "items", () => createLocalstorageMenu(false),
        "mdi-delete-outline"
    ) as Menu;

    // Menu to save a project in browser storage
    const buttonSaveInBrowser: Menu = createLocalstorageButton(
        $t('taskbar_storage_savebrowser'), "action", () => () => ImportExportUi.localstorage.save(false),
        "mdi-content-save-outline"
    ) as Menu;

    // Menu to save a project with a specific name in browser storage
    const buttonSaveAsInBrowser: Menu = createLocalstorageButton(
        $t('taskbar_storage_saveasbrowser'), "action", () => () => ImportExportUi.localstorage.save(true),
        "mdi-content-save-all-outline"
    ) as Menu;

    return {
        create: [menuOpenFromBrowser],
        save: [buttonSaveInBrowser, buttonSaveAsInBrowser],
        delete: [menuDeleteFromBrowser],
    }
}

// Creates a menu with the localstorage projects
// If isOpen is true, clicking a project will open it
// If isOpen is false, clicking a project will delete it
function createLocalstorageMenu(isOpen: boolean): () => MenuItem[] {
    return () => {
        const projs = ImportExportUi.localstorage.list().map(name => ({
            text: name,
            action: isOpen ? () => ImportExportUi.localstorage.load(name) : () => ImportExportUi.localstorage.delete(name),
            icon: isOpen ? undefined : "mdi-delete-outline"
        }));

        if (projs.length > 0)
            return projs;

        return [{
            text: $t('storage_error_nofound_text'),
            title: $t('storage_error_nofound_title'),
            disabled: true,
            action: () => { },
        }];
    }
}

// Creates the items to use if direct file access (File-system api) is not available in the browser
function createLagacyItems() {

    // Open (Upload File)
    const buttonUploadFile: Button = {
        text: $t('taskbar_storage_openupload_text'), action: ImportExportUi.lagacy.open,
        title: $t('taskbar_storage_openupload_title'), icon: "mdi-upload"
    };

    // Save (Download File)
    const buttonDownloadFile: Button = {
        text: $t('taskbar_storage_savedownload_text'), action: ImportExportUi.lagacy.save,
        title: $t('taskbar_storage_savedownload_title'), icon: "mdi-download"
    }

    return {
        create: [
            buttonUploadFile,
        ],
        save: [
            buttonDownloadFile,
        ]
    }

}

function createFileApiItems() {

    // Open
    const buttonOpen: Button = {
        text: $t('taskbar_storage_fileapi_open_txt'), action: ImportExportUi.api.openFile,
        title: $t('taskbar_storage_fileapi_open_title'), icon: "mdi-open-in-app"
    };
    const buttonSave: Button = {
        text: $t('taskbar_storage_fileapi_save_txt'), action: ImportExportUi.api.saveFile,
        title: $t('taskbar_storage_fileapi_save_title'), icon: "mdi-content-save-outline"
    };
    const buttonSaveAs: Button = {
        text: $t('taskbar_storage_fileapi_save_as_txt'), action: ImportExportUi.api.saveFileAs,
        title: $t('taskbar_storage_fileapi_save_as_title'), icon: "mdi-content-save-all-outline"
    };

    return {
        create: [ buttonOpen ],
        save: [ buttonSave, buttonSaveAs ]
    }
}