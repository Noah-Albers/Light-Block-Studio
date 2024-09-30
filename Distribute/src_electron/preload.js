const { contextBridge: CB, ipcRenderer: IPC } = require('electron');

// TODO: Add way for "SecureSide"/Electron to ensure only file with correct "." ending are written and read from

const readFile = (path) => IPC.sendSync("read-file", path);

const writeFile = (path, data) => IPC.sendSync("write-file",path, data);

const openDialog = (title) => IPC.sendSync("open-dialog", title)

const saveDialog = (title, path) => IPC.sendSync("save-dialog", title, path)

const openURL = (url) => IPC.send("open-url", url);

const openDevTools = ()=> IPC.send("open-dev-tools");

const closeWindow = ()=> IPC.send("close-window");

const readSettingsFile = ()=>IPC.sendSync("read-settings");
const writeSettingsFile = (data)=>IPC.sendSync("write-settings", data);

const pathBasename = (path)=>IPC.sendSync("path-basename",path);


// Exposes all these functions using an electronAPI-Global object
CB.exposeInMainWorld("desktopAPI", {
    readFile,
    writeFile,
    openDialog,
    saveDialog,
    openURL,
    openDevTools,
    closeWindow,
    writeSettingsFile,
    readSettingsFile,
    pathBasename,
});