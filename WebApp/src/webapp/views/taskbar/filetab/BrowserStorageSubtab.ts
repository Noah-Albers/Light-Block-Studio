import { C } from "@webapp/utils/html/HTMLBuilder";
import { Button, Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { $t } from "@localisation/Fluent";
import { exportProject } from "../../../storage/project/ProjectExporter";
import { importProject } from "../../../storage/project/ProjectImporter";
import { isLocalstorageSupported } from "@utils/Localstorage";
import { makeValidFilename } from "@utils/FileUtils";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import Branding from "../../../../Branding";



/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createBrowserStorageMenuItems() {
    
    const lsItms = createLocalstorageItems();
    const browserItms = isFileApiSupported() ? createFileApiItems() : createLagacyItems();

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


//#region Localstorage

const LS_PROJECTS_PREFIX = "proj_";

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
        $t('taskbar_storage_savebrowser'), "action", () => () => saveLocalstorageProject(false),
        "mdi-content-save-outline"
    ) as Menu;

    // Menu to save a project with a specific name in browser storage
    const buttonSaveAsInBrowser: Menu = createLocalstorageButton(
        $t('taskbar_storage_saveasbrowser'), "action", () => () => saveLocalstorageProject(true),
        "mdi-content-save-all-outline"
    ) as Menu;

    return {
        create: [menuOpenFromBrowser],
        save: [buttonSaveInBrowser, buttonSaveAsInBrowser],
        delete: [menuDeleteFromBrowser],
    }
}


function getProjectSaveAsName() {
    let name = undefined;

    const store = useProjectStore();

    while (name === undefined) {
        // Askes the user for a name
        name = prompt($t('storage_prompt_save_as'), store.projectName) || undefined;

        if (name === undefined)
            return undefined;

        if (
            localStorage.getItem(LS_PROJECTS_PREFIX + name) !== null &&
            confirm($t('storage_prompt_alreadyexists', { name }))
        )
            break;
    }

    return name;
}

// Creates a menu with the localstorage projects
// If isOpen is true, clicking a project will open it
// If isOpen is false, clicking a project will delete it
function createLocalstorageMenu(isOpen: boolean): () => MenuItem[] {
    return () => {
        const projs = listLocalstorageProjects().map(name => ({
            text: name,
            action: isOpen ? () => loadLocalstorageProject(name) : () => deleteLocalstorageProject(name),
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

// Returns a list of projects which are stored inside the browsers localstorage
function listLocalstorageProjects() {
    // Gets all project names
    const projNames = Object.keys(localStorage).filter(x => x.startsWith(LS_PROJECTS_PREFIX)).map(x => x.substring(LS_PROJECTS_PREFIX.length));

    return projNames;
}

// Takes in a filename to load from local-storage
function loadLocalstorageProject(name: string) {
    const itm = localStorage.getItem(LS_PROJECTS_PREFIX + name);

    if (itm === null) {
        console.warn(`Tried to load unknown project from localstorage: '${name}'`)
        return;
    }

    onProjectLoad(name, itm);
}

// Takes in a filename of a local-storage project and deltes it
function deleteLocalstorageProject(name: string) {
    // Confirms the deletion
    if (!confirm($t('storage_prompt_reallydelete', { name })))
        return;

    localStorage.removeItem(LS_PROJECTS_PREFIX + name);
}

// Exports the current project and saves it to localstorage using the given name
// If no name is given, the user is asked for a name
async function saveLocalstorageProject(askName: boolean) {

    const name = askName ? getProjectSaveAsName() : useProjectStore().projectName;

    // If the save as was aborted
    if (name === undefined)
        return;

    // Exports the project
    const expProj = JSON.stringify(await exportProject());

    // Writes the project
    localStorage.setItem(LS_PROJECTS_PREFIX + name, expProj);
}

//#endregion

//#region Lagacy Up/Download from device

// Creates the items to use if direct file access (File-system api) is not available in the browser
function createLagacyItems() {

    /**
     * Called to upload a file
     */
    function uploadFile() {

        // Step 2
        // Event: When the text is finally read on
        function onReadText(filename: string, evt: Event) {
            try {
                // Gets the content
                var cont = (evt as any).target.result;

                // Tries to load the environment from that file
                onProjectLoad(filename, cont);
            } catch (exc) {
                console.warn("Failed to open file", exc);
            }
        }

        // Step 1
        // Event: When the file is beeing loaded
        function onLoadFile(evt: Event) {
            var file = (evt as any).target.files[0];
            if (!file)
                return false;

            var reader = new FileReader();
            reader.onload = (evt) => onReadText(file.name, evt);
            reader.readAsText(file);

            return false;
        }

        // Creates the file-input-element
        // Creates an fiel input element
        var impBtn = C("input", { type: "file", style: "display: none" });
        impBtn.addEventListener("change", onLoadFile);

        // Clicks the element
        impBtn.click();
    }

    // Open (Upload File)
    const buttonUploadFile: Button = {
        text: $t('taskbar_storage_openupload_text'), action: uploadFile,
        title: $t('taskbar_storage_openupload_title'), icon: "mdi-upload"
    };

    // Save (Download File)
    const buttonDownloadFile: Button = {
        text: $t('taskbar_storage_savedownload_text'), action: async () => {

            // Raw project json
            const rawJson = await exportProject();

            // Project name
            const name = useProjectStore().projectName;

            // Creates the file
            var file = new Blob([JSON.stringify(rawJson)], {
                endings: "native",
                type: "text/json"
            });

            // Creates an element to download the element
            var a = document.createElement("a");
            var url = a.href = URL.createObjectURL(file);

            // Sets the filename
            a.download = makeValidFilename(name + "." + Branding.FILE_EXTENSION)

            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);

        },
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

// Event: When a project got loaded and shall be imported
async function onProjectLoad(filename: string, rawProj: string, handler?: FileSystemFileHandle) {
    const res = await importProject(filename, rawProj, (msg, btnTrue, btnFalse) => {

        return new Promise((res) => {
            SignalDispatcher.emit(Signals.DISPLAY_POPUP, {
                message: msg,
                no: btnFalse,
                yes: btnTrue,
                onResolve: (a) => res(a == "yes")
            });
        });
    }, undefined);

    if (res.success) {
        // Updates the handler
        useProjectStore().filePointer = handler;
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

//#endregion

//#region File-Storage Api

function createFileApiItems() {

    // Open
    const buttonOpen: Button = {
        text: $t('taskbar_storage_fileapi_open_txt'), action: openFile,
        title: $t('taskbar_storage_fileapi_open_title'), icon: "mdi-open-in-app"
    };
    const buttonSave: Button = {
        text: $t('taskbar_storage_fileapi_save_txt'), action: saveFile,
        title: $t('taskbar_storage_fileapi_save_title'), icon: "mdi-content-save-outline"
    };
    const buttonSaveAs: Button = {
        text: $t('taskbar_storage_fileapi_save_as_txt'), action: saveFileAs,
        title: $t('taskbar_storage_fileapi_save_as_title'), icon: "mdi-content-save-all-outline"
    };

    return {
        create: [ buttonOpen ],
        save: [ buttonSave, buttonSaveAs ]
    }
}

// Takes in a file pointer and write the current project file to it. Note that this might throw an exception
async function saveFileToPtr(ptr: FileSystemFileHandle) {
    // Raw project json
    const rawJson = await exportProject();

    const writeStream = await ptr.createWritable({ keepExistingData: false });
    await writeStream.write(JSON.stringify(rawJson));
    await writeStream.close();
}

async function saveFile() {
    const store = useProjectStore();

    if (store.filePointer === undefined)
        return await saveFileAs();

    try {
        return saveFileToPtr(store.filePointer);
    } catch (err) {
        if (`${err}`.indexOf("AbortError") !== -1) return;
        console.error("Failed to write project file", err);

        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            type: "error",
            timeout: 5000,
            text: $t('storage_error_failedtowrite')
        });
    }
}

async function saveFileAs() {
    try {
        if(true) throw new Error("");
        // Gets the new location
        const fp = await window.showSaveFilePicker({
            types: [{
                description: 'Text Files',
                accept: {
                    'application/json': ['.' + Branding.FILE_EXTENSION as any],
                },
            }],
            suggestedName: useProjectStore().projectName + "." + Branding.FILE_EXTENSION
        });

        // Saves the file
        await saveFileToPtr(fp);
        useProjectStore().filePointer = fp;
    } catch (err) {
        if (`${err}`.indexOf("AbortError") !== -1) return;
        console.error("Failed to write project file", err);

        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            type: "error",
            timeout: 5000,
            text: $t('storage_error_failedtowrite')
        });
    }
}

async function openFile() {
    try {
        const [fp] = await window.showOpenFilePicker({
            multiple: false,
            types: [{
                description: 'Text Files',
                accept: {
                    'application/json': ['.' + Branding.FILE_EXTENSION as any],
                },
            }],
        });

        const file = await fp.getFile();
        const contents = await file.text();

        await onProjectLoad(file.name, contents);

        useProjectStore().filePointer = fp;
    } catch (err) {
        if (`${err}`.indexOf("AbortError") !== -1) return;
        console.error("Failed to read project file", err);

        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            type: "error",
            timeout: 5000,
            text: $t('storage_error_failedtoload')
        });
    }
}

function isFileApiSupported() {
    return 'showOpenFilePicker' in self;
}

//#endregion