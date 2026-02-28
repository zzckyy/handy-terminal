const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const pty = require('node-pty')

function windowView() {
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

  // spawn real shell
  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  })

  let alive = true

  // kirim output shell ke renderer (AMAN)
  shell.onData(data => {
    if (alive && !win.isDestroyed()) {
      win.webContents.send('terminal:data', data)
    }
  })

  // terima input dari renderer
  ipcMain.on('terminal:write', (_, data) => {
    if (alive) shell.write(data)
  })

  ipcMain.on('terminal:open-script', async() => 
  {
    const result = await dialog.showOpenDialog(
      {
        title: 'Open Bash Script - sh',
        properties: ['openFile'],
        filters:[
          { name: 'Bash Script', extensions: ['sh'] },
          { mame: 'All files', extensions:  ['*'] }
        ]
      }
    )

    if (result.canceled || result.filePaths.length === 0) return
    
    const scriptPath = result.filePaths[0]

    shell.write(`bash "${scriptPath}"\r`)
      
  })

  // shortcut
  win.webContents.on('before-input-event', (_, input) => {
    if (input.key === 'Escape') {
      dynamicWindow(win)
    }

    if (input.control && input.key.toLowerCase() === 'n') {
      windowView()
    }
  })

  win.on('closed', () => {
    alive = false
    shell.kill()
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Bash Script', click: () => {
        win.webContents.send('terminal:open-script-trigger')
    }},
    {type: 'separator'},
    { label: 'Select All', role: 'selectAll' },
    { label: 'Copy', role: 'copy' },
    { label: 'Paste', role: 'paste' },
    { label: 'Cut', role: 'cut' }
  ])

  win.webContents.on('context-menu', () => {
    contextMenu.popup()
  })
}

function dynamicWindow(win) {
  const windows = BrowserWindow.getAllWindows()

  if (windows.length > 1) {
    win.destroy()
  } else {
    app.quit()
  }
}

app.whenReady().then(windowView)