import { C } from "@webapp/utils/html/HTMLBuilder";
import { Button, Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { $t } from "@localisation/Fluent";
import { exportProject } from "../ProjectExporter";
import { importProject } from "../ProjectImporter";
import { isLocalstorageSupported } from "@utils/Localstorage";
import { makeValidFilename } from "@utils/FileUtils";

/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createBrowserStorageMenuItems(): MenuItem[] {

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
            a.download = makeValidFilename(name + ".json")

            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);

        },
        title: $t('taskbar_storage_savedownload_title'), icon: "mdi-download"
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




    return [
        // New
        buttonUploadFile,
        menuOpenFromBrowser,
        // Open recent menu (Desktop only)

        "seperator",
        buttonDownloadFile,
        buttonSaveInBrowser,
        buttonSaveAsInBrowser,

        "seperator",
        menuDeleteFromBrowser
    ];
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
            localStorage.getItem(PROJECTS_PREFIX + name) !== null &&
            confirm($t('storage_prompt_alreadyexists', { name }))
        )
            break;
    }

    return name;
}

//#region Localstorage

const PROJECTS_PREFIX = "proj_";

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
    const projNames = Object.keys(localStorage).filter(x => x.startsWith(PROJECTS_PREFIX)).map(x => x.substring(PROJECTS_PREFIX.length));

    return projNames;
}

// Takes in a filename to load from local-storage
function loadLocalstorageProject(name: string) {
    const itm = localStorage.getItem(PROJECTS_PREFIX + name);

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

    localStorage.removeItem(PROJECTS_PREFIX + name);
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
    localStorage.setItem(PROJECTS_PREFIX + name, expProj);
}

//#endregion

//#region Up/Download from device

// Event: When a project got loaded and shall be imported
async function onProjectLoad(filename: string, rawProj: string) {
    const res = await importProject(filename, rawProj, (msg, btnTrue, btnFalse) => {

        // TODO: Translate after replacing confirm with a web-based call to action

        return Promise.resolve(confirm(`${msg}:\n\nOk: ${btnTrue}\nCancle: ${btnFalse};`))
    });

    if (res.success)
        return;

    if (res.message !== undefined)
        alert($t('storage_error_failedtoload'));

    console.warn("Failed to load Project", res.message);
}

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

//#endregion