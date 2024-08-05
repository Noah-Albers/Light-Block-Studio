import { debounce } from "@utils/Debounse";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { importGlobalsettings } from "./GlobalSettingsImporter";
import { isLocalstorageSupported } from "@utils/Localstorage";
import { exportGlobalSettings } from "./GlobalSettingsExporter";

// Name for the localstorage item for the global settings
const LS_NAME = "globalsettings";


/**
 * Event-Handler: When the Global settings store changes
 */
const onGlobalSettingsChange = debounce(()=>{
    
    // TODO: Browser vs Desktop api to save the settings file

    // TODO: Following is for browser only
    if(isLocalstorageSupported())
        localStorage.setItem(LS_NAME, JSON.stringify(exportGlobalSettings()));

    console.debug("LocalStorage saved settings (If supported)");

}, 1000);

// Loads the global settings
function loadGlobalSettings(){

    // TODO: Browser vs desktop api to load the global settings file

    // TODO: Following is for browser only
    if(!isLocalstorageSupported())
        return;

    const settings = localStorage.getItem(LS_NAME)

    // Ensures the user had their settings saved at some point
    if(settings === null)
        return;

    // Imports the settings
    importGlobalsettings(settings);
}

export function setupGlobalSettingsManager(){
    const store = useSettingsStore();

    loadGlobalSettings();

    // Creates a debounced version of the function
    store.$subscribe(onGlobalSettingsChange);
}