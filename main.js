const { app, BrowserWindow, Menu, globalShortcut } = require('electron')

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

    win.webContents.on('before-input-event', (event, input) => {
        if(input.key == 'Escape' )
        {
            dynamicWindow(win)
        }

        if(input.control && input.key.toLowerCase() === "n")
        {
            createWindow()
        }
    })
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

function dynamicWindow(win)
{
    const windows = BrowserWindow.getAllWindows()

    if(windows.length > 1)
    {
        win.close()
    }

    else{
        app.quit()
        
    }
}

app.whenReady().then(createWindow)