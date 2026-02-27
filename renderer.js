const { ipcRenderer } = require('electron')

const output = document.getElementById('output')
const cmdInput = document.getElementById('cmd')

let history = []
let historyIndex = -1

function stripAnsi(data) {
  return data
    // ANSI CSI
    .replace(/\x1B\[[0-9;?]*[ -/]*[@-~]/g, '')
    // ANSI OSC
    .replace(/\x1B\][^\x07]*(\x07|\x1B\\)/g, '')
    // control chars aneh
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '')
}

// TERIMA OUTPUT DARI PTY
ipcRenderer.on('terminal:data', (_, data) => {
    const clean = data.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
                     .replace(/\x1b\][^\x07]*\x07/g, '')

    output.textContent += stripAnsi(data)
    output.scrollTop = output.scrollHeight
})

cmdInput.addEventListener('keydown', (e) => {

    // ENTER → kirim ke shell + simpan history
    if (e.key === 'Enter') {
        const command = cmdInput.value

        if (command.trim() !== '') {
            history.push(command)
            historyIndex = history.length
        }

        // kirim ke PTY (ENTER = \\r)
        ipcRenderer.send('terminal:write', command + '\r')

        cmdInput.value = ''
    }

    // ARROW UP → history
    if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (history.length === 0) return

        historyIndex = Math.max(0, historyIndex - 1)
        cmdInput.value = history[historyIndex]
    }

    // ARROW DOWN → history
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (history.length === 0) return

        historyIndex = Math.min(history.length, historyIndex + 1)
        cmdInput.value =
            historyIndex === history.length ? '' : history[historyIndex]
    }
})