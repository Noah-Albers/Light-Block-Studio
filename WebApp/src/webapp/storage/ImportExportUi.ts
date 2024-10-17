import { C } from "@webapp/utils/html/HTMLBuilder";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { $t } from "@localisation/Fluent";
import { exportProject } from "../storage/project/ProjectExporter";
import { importProject } from "../storage/project/ProjectImporter";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import Branding from "../../Branding";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import FileUtils from "@utils/FileUtils";


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

//#region Localstorage

const LS_PROJECTS_PREFIX = "proj_";

// Gets the name that the project shall be saved as (Either by storage or by prompting the user)
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

// Call this to open a file-upload window
function openLagacyUpload() {
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

// Call to download the project as a file
async function saveLagacyDownload() {

    // Raw project json
    const rawJson = await exportProject();

    // Project name
    const name = useProjectStore().projectName;

    // Prompts the user to download the file
    FileUtils.promptDownload(JSON.stringify(rawJson), "text/json", `${name}.${Branding.FILE_EXTENSION}`);
}

//#endregion

//#region File-Storage Api

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

//#region Desktop-Api

// Event: When the user clicks on save or save-as
async function onDesktopSave(action: "save" | "saveas"){
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
                    onDesktopSave(action)
            },
        });
        return;
    }

    // Adds the path to the known paths
    useSettingsStore().addRecentProject(path);
}

// Event: Called when a file is choosen and need to be loaded
async function onDesktopOpen(path: string) {
    
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
function onDesktopOpenClicked() {
    const openResult = DesktopApi.openDialog($t('storage-desktop_load_title'));

    if (openResult === undefined) return;

    onDesktopOpen(openResult);
}

function getDesktopRecentProjects(){
    return useSettingsStore().recentProjectPaths;
}

//#endregion


function getDefaults(){

    if(DesktopApi.isDesktop())
        return {
            open: onDesktopOpenClicked,
            save: ()=>onDesktopSave("save"),
            saveAs: ()=>onDesktopSave("saveas"),
        }

    if(isFileApiSupported())
        return {
            open: openFile,
            save: saveFile,
            saveAs: saveFile
        }

    return {
        open: openLagacyUpload,
        save: saveLagacyDownload,
        saveAs: saveLagacyDownload
    }
}

export default {
    isFileApiSupported,

    desktop: {
        recentProjects: getDesktopRecentProjects,
        openDialog: onDesktopOpenClicked,
        openProject: onDesktopOpen,
        save: onDesktopSave
    },

    localstorage:{
        list: listLocalstorageProjects,
        load: loadLocalstorageProject,
        delete: deleteLocalstorageProject,
        save: saveLocalstorageProject,
    },

    lagacy: {
        save: saveLagacyDownload,
        open: openLagacyUpload
    },

    api: {
        saveFile,
        saveFileAs,
        openFile
    },

    default: getDefaults()
}