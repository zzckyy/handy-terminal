const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        resizable: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadFile('index.html')
    //   win.setMenu(null)
    // bikin context menu
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Select All', role: 'selectAll'},
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'cut', role: 'cut'}
    ])

    win.webContents.on('context-menu', (e) => {
        contextMenu.popup()
    })
}



app.whenReady().then(createWindow)