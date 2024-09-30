const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const ElectronAPI = require("./backend/ElectronApiRegister");

const createWindow = () => {
    // Create the browser window.
    global.win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: "#000000"
    })
    global.win.removeMenu();

    if (process.env.IS_DEVELOPMENT)
        global.win.loadURL("http://localhost:3000");
    else
        global.win.loadFile('webapp/index.html')
}

// initialization and is ready to create browser windows.
app.whenReady().then(() => {

    // Registers the api-endpoints
    ElectronAPI.init();
    
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.