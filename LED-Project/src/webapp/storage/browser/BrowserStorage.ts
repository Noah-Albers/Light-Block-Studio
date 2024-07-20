import { C } from "@webapp/utils/html/HTMLBuilder";
import { MenuItem } from "@webapp/utils/taskbar/TaskBar";
import { importProject } from "../project/ProjectImporter";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { exportProject } from "../project/ProjectExporter";

/**
 * Creates the menu items to use the browser for storing projects and settings
 */
export function createBrowserStorageMenuItems(): MenuItem[] {

    let items: MenuItem[] = [];

    // Open (Upload File)
    items.push({ text: "Open (Upload File)", action: uploadFile, title: "Upload a file into this webpage" });

    // TODO
    // Open from Browser
    //      -> File
    // Delete file from Browser
    // Save (Download File)
    // Save in Browser

    // Checks if localstorage is supported
    if(isLocalstorageSupported()){
        items = [
            ...items,
            {
                text: "Open from Browser", items: ()=>createLocalstorageMenu(true),
            }, {
                text: "Delete from Browser", items: ()=>createLocalstorageMenu(false),
            }, {
                text: "Save in Browser", action: ()=>saveLocalstorageProject(false)
            }, {
                text: "Save as in Browser", action: ()=>saveLocalstorageProject(true)
            }
        ];
    }else{
        for(let item of [
            "Open from Browser",
            "Delete from Browser",
            "Save in Browser",
            "Save as in Browser"
        ])
            items.push({ text: item, items: [], disabled: true, title: "Localstorage is not enabled in browser" });
    }


    return items;
}

function getProjectSaveAsName(){
    let name = undefined;

    const store = useProjectStore();

    while(name === undefined){
        // Askes the user for a name
        name = prompt("Save as", store.projectName) || undefined;

        if(name === undefined)
            return undefined;

        if(
            localStorage.getItem(PROJECTS_PREFIX+name) !== null &&
            confirm(`A project named '${name}' already exists. Do you want to overwrite it?`)
        )
            break;
    }

    return name;
}

//#region Localstorage

const PROJECTS_PREFIX = "proj_";

function isLocalstorageSupported(){
    return typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined";
}

// Creates a menu with the localstorage projects
// If isOpen is true, clicking a project will open it
// If isOpen is false, clicking a project will delete it
function createLocalstorageMenu(isOpen: boolean) : MenuItem[]{
    
    const projs = listLocalstorageProjects().map(name=>({
        text: name,
        action: isOpen ? ()=>loadLocalstorageProject(name) : ()=>deleteLocalstorageProject(name)
    }));

    if(projs.length <= 0)
        return [{
            text: "...",
            title: "No projects found",
            disabled: true,
            action: ()=>{}
        }];

    return projs;
}

// Returns a list of projects which are stored inside the browsers localstorage
function listLocalstorageProjects() {
    // Gets all project names
    const projNames = Object.keys(localStorage).filter(x=>x.startsWith(PROJECTS_PREFIX)).map(x=>x.substring(PROJECTS_PREFIX.length));

    return projNames;
}

// Takes in a filename to load from local-storage
async function loadLocalstorageProject(name: string) {
    const itm = localStorage.getItem(PROJECTS_PREFIX+name);

    if(itm === null){
        console.warn(`Tried to load unknown project from localstorage: '${name}'`)
        return;
    }

    const res = await importProject(name, itm, (msg, btnTrue, btnFalse)=>{
        return Promise.resolve(confirm(`${msg}:\n\nOk: ${btnTrue}\nCancle: ${btnFalse};`))
    });

    if(res.success)
        return;

    alert(`Failed to load Project...\nPlease check the console for more information on the error.`);

    console.warn("Failed to load Project", res.message);
}

// Takes in a filename of a local-storage project and deltes it
function deleteLocalstorageProject(name: string){
    // Confirms the deletion
    if(!confirm(`Do you really want to delete the Project '${name}'?`))
        return;

    localStorage.removeItem(PROJECTS_PREFIX+name);
}

// Exports the current project and saves it to localstorage using the given name
// If no name is given, the user is asked for a name
async function saveLocalstorageProject(askName: boolean){

    const name = askName ? getProjectSaveAsName() : useProjectStore().projectName;

    // If the save as was aborted
    if(name === undefined)
        return;

    // Exports the project
    const expProj = JSON.stringify(await exportProject());

    // Writes the project
    localStorage.setItem(PROJECTS_PREFIX+name, expProj);
}

//#endregion

//#region Up/Download from device

// Event: When a project got loaded and shall be imported
function onProjectLoad(rawProj: string) {
    console.log("TODO: Import project:",rawProj);
}

/**
 * Called to upload a file
 */
function uploadFile() {

    // Step 2
    // Event: When the text is finally read on
    function onReadText(evt: Event) {
        try {
            // Gets the content
            var cont = (evt as any).target.result;

            // Tries to load the environment from that file
            onProjectLoad(cont);
        } catch (exc) {
            console.warn("Failed to open file",exc);
        }
    }

    // Step 1
    // Event: When the file is beeing loaded
    function onLoadFile(evt: Event) {
        var file = (evt as any).target.files[0];
        if (!file)
            return false;

        var reader = new FileReader();
        reader.onload = onReadText;
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