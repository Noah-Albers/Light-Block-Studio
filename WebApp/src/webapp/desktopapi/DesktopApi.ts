// This is the "API" that takes care of executing actions on the desktop
// or web-browser (Depending on which platform the code is run)

// Api to access
const desktopApi = (window as any).desktopAPI;

// Returns if this application is run on the desktop
const isDesktop = ()=>desktopApi !== undefined; 

/**
 * Reads in a file from the file-system.
 * 
 * Note: Requires the file to have the applications default file-extension or it will fail for
 * security reasons
 * 
 * @param path the path to the file
 * 
 * @returns the read file content or undefined if an error occurred
 */
const readFile: (path: string)=>string|undefined = desktopApi.readFile;
/**
 * Writes a fie to the file-system
 * Note: Requires the file to have the applications default file-extensions or it will fail for
 * security reasons
 * 
 * @param path the path to the file
 * @param data the actual data to write to the file
 * 
 * @returns true if all worked fine and undefined if an error occurred
 */
const writeFile: (path: string, data: string)=>undefined|true = desktopApi.writeFile;

/**
 * Opens the systems open dialog
 * @param title the title to show in the dialog
 * @returns the path of the requested file or undefined if the dialog was aborted
 */
const openDialog: (title: string)=>string|undefined = desktopApi.openDialog;

/**
 * Opens the systems save dialog
 * @param title the title to show in the dialog
 * @param path the default path to point the user to
 * @return the path of the requested file or undefined if the dialog was aborted 
 */
const saveDialog: (title: string, path: string)=>string|undefined = desktopApi.saveDialog;

/**
 * Opens a given url using the systems default web-browser
 * @param url the url to open
 */
const openURL: (url: string)=>void = desktopApi.openURL;
/**
 * Opens the dev-tools
 */
const openDevTools: ()=>void = desktopApi.openDevTools;
/**
 * Closes the window and application
 */
const closeWindow: ()=>void = desktopApi.closeWindow;

/**
 * Reads in the settings file and returns its content
 * @returns the content of the settings file or undefined on error
 */
const readSettingsFile: ()=>string|undefined = desktopApi.readSettingsFile;
/**
 * Writes data to the settings file
 * @returns true if the write was successful and undefined otherwise
 */
const writeSettingsFile: (data: string)=>true|undefined = desktopApi.writeSettingsFile;

export default {
    readFile,
    writeFile,

    openDialog,
    saveDialog,

    openURL,
    openDevTools,
    closeWindow,

    readSettingsFile,
    writeSettingsFile,

    isDesktop
}