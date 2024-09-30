
const { ipcMain: IPC, dialog, shell } = require('electron');
const fs = require("fs");
const path = require("path");

// Path to the settings
const PATH_SETTINGS_FILE = "settings.json";

//#region API-Endpoints

/**
 * Requests the global settings file
 * @returns {string|undefined} the file contents and undefined if an error ocurred
 */
function requestReadSettingsFile(evt) {
    try{
        // Reads in the file using utf-8
        evt.returnValue = fs.readFileSync(PATH_SETTINGS_FILE, {encoding:'utf8', flag:'r'});
    }catch(e){
        evt.returnValue = undefined;
    }
}

/**
 * Writes data to the global settings file
 * @param {string} data
 * @returns true if the write operation worked and undefined if an error occured
 */
function requestWriteSettingsFile(evt, data){
    try{
        var base = path.dirname(PATH_SETTINGS_FILE);
    
        // Ensures the parent directory exists
        fs.mkdirSync(base,{
            recursive: true
        });

        fs.writeFileSync(PATH_SETTINGS_FILE, data);
        evt.returnValue = true;
    }catch(e){
        console.error(e);
        evt.returnValue = undefined;
    }
}

/**
 * Shows the native file save dialog
 * @param {string} title window title 
 * @param {string} defaultPath default path to show to the user
 * @returns {undefined | string} the path to the file
 */
function requestSaveFileDialog(evt, title, defaultPath){

    if(typeof title !== "string")
        return evt.returnValue = undefined;

    if(typeof defaultPath !== "string" && typeof defaultPath !== "undefined")
        return evt.returnValue = undefined;

    evt.returnValue = dialog.showSaveDialogSync(global.win, {
        title,
        filters: [{
            // TODO: Update
            extensions: [".json"],
            name: "Project-File"
        }],
        properties: ["showOverwriteConfirmation"],
        defaultPath
    });
}

/**
 * Shows the native file open dialog
 * @param {string} title window title 
 * @returns {undefined | string} the path to the file
 */
function requestOpenFileDialog(evt, title){

    if(typeof title !== "string"){
        evt.returnValue = undefined;
        return;
    }

    // Opens the dialog
    var res = dialog.showOpenDialogSync(global.win, {
        properties: ['openFile'],
        title,
        filters: [{
            // TODO: Update
            extensions: [".json"],
            name: "Project-File"
        }],
    });

    // Validates
    if(res === undefined){
        evt.returnValue = undefined;
        return;
    }

    // Ensures a single select
    if(res.length !== 1){
        evt.returnValue = undefined;
        return;
    }

    // Sets the return value
    evt.returnValue = res[0];
}


/**
 * Open the given url inside the system-default browser
 * @param {string} url 
 */
function requestOpenURL(evt, url) {
    shell.openExternal(url);
}

// Opens the devtools on the window
function requestOpenDevTools(evt){
    global.win.openDevTools();
}

// Closes the electron-window and therefor exits the application
function requestCloseWindow(evt){
    global.win.close();
}

/**
 * Writes data to a file from the file system.
 * 
 * TODO: Change
 * Also ensures that the file has a ".json" ending to prevent writing to various files
 * @param {string} path the path of the file 
 * @param {string} data the data to write into the file
 * @returns {true|undefined} true if the file was successfully written and undefined if an error ocurred
 */
function requestWriteFile(evt, selectedPath, data){
    if(typeof selectedPath !== "string")
        return evt.returnValue = undefined;
    if(typeof data !== "string")
        return evt.returnValue = undefined;
    
    // TODO: Change
    // Ensure only project-files are opened
    if(!selectedPath.endsWith(".json"))
        return evt.returnValue = undefined;

    try{
        var base = path.dirname(selectedPath);
    
        // Ensures the parent directory exists
        fs.mkdirSync(base,{
            recursive: true
        });

        fs.writeFileSync(selectedPath, data);
        evt.returnValue = true;
    }catch(e){
        console.error(e);
        evt.returnValue = undefined;
    }
}

/**
 * Reads in a file from the file system.
 * 
 * TODO: Change
 * Also ensures that the file has a ".json" ending to prevent reading in various files
 * @param {string} path the path of the file 
 * @returns {string | undefined} the data read from the file
 */
function requestReadFile(evt, path){

    if(typeof path !== "string")
        return evt.returnValue = undefined;

    // TODO: Change
    // Ensure only project-files are opened
    if(!path.endsWith(".json"))
        return evt.returnValue = undefined;

    try{
        // Reads in the file using utf-8
        evt.returnValue = fs.readFileSync(path, {encoding:'utf8', flag:'r'});
    }catch(e){
        evt.returnValue = undefined;
    }
}

// Requests the base path of a given string (Path)
function requestPathBasename(evt, reqPath){
    evt.returnValue = path.basename(reqPath);
}

//#endregion

// Registers all nodejs/electron-api-endpoints
function init(){
    IPC.on("open-dialog", requestOpenFileDialog);
    IPC.on("save-dialog", requestSaveFileDialog);

    IPC.on("open-url", requestOpenURL);
    IPC.on("open-dev-tools", requestOpenDevTools);
    IPC.on("close-window", requestCloseWindow);
    
    IPC.on("read-file", requestReadFile);
    IPC.on("write-file", requestWriteFile);

    IPC.on("read-settings", requestReadSettingsFile);
    IPC.on("write-settings", requestWriteSettingsFile);

    IPC.on("path-basename", requestPathBasename);
}

module.exports = { init }