import { debounce } from "@utils/Debounse";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { importGlobalsettings } from "./GlobalSettingsImporter";
import { isLocalstorageSupported } from "@utils/Localstorage";
import { exportGlobalSettings } from "./GlobalSettingsExporter";
import DesktopApi from "@webapp/desktopapi/DesktopApi";

// Name for the localstorage item for the global settings
const LS_NAME = "globalsettings";


/**
 * Event-Handler: When the Global settings store changes
 */
const onGlobalSettingsChange = debounce(()=>{
    
    const content = JSON.stringify(exportGlobalSettings());

    console.log("Write settings to "+(DesktopApi.isDesktop() ? "Desktop" : "Browser"))
    if(DesktopApi.isDesktop()){
        DesktopApi.writeSettingsFile(content)
    }else{
        // TODO: Following is for browser only
        if(isLocalstorageSupported())
            localStorage.setItem(LS_NAME, content);
    }

}, 1000);

// Loads the global settings
function loadGlobalSettings(){

    var rawLoaded: string|null|undefined;

    if(DesktopApi.isDesktop()){
        rawLoaded = DesktopApi.readSettingsFile();
    }else{
        if(!isLocalstorageSupported())
            return;
    
        rawLoaded = localStorage.getItem(LS_NAME);
    }
    
    // Ensures the user had their settings saved at some point
    if(typeof rawLoaded !== "string")
        return;

    // Imports the settings
    importGlobalsettings(rawLoaded);
}

export function setupGlobalSettingsManager(){
    const store = useSettingsStore();

    loadGlobalSettings();

    // Creates a debounced version of the function
    store.$subscribe(onGlobalSettingsChange);
}