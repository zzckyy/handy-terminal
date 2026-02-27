const { exec } = require('child_process')
const output = document.getElementById('output')
const cmdInput = document.getElementById('cmd')

let history = []
let historyIndex = -1

cmdInput.addEventListener('keydown', (e) => {

  // ENTER → execute + simpan history
  if (e.key === 'Enter') {
    const command = cmdInput.value.trim()
    if (command !== '') {
      history.push(command)
    }
    historyIndex = history.length

    output.innerHTML += `> ${command}\n`

    exec(command, (err, stdout, stderr) => {
      if (err) output.innerHTML += `Error: ${err.message}\n`
      if (stderr) output.innerHTML += `${stderr}\n`
      if (stdout) output.innerHTML += `${stdout}\n`
      output.scrollTop = output.scrollHeight
    })

    cmdInput.value = ''
  }

  // ARROW UP → command sebelumnya
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (history.length === 0) return

    historyIndex = Math.max(0, historyIndex - 1)
    cmdInput.value = history[historyIndex]
  }

  // ARROW DOWN → command berikutnya
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (history.length === 0) return

    historyIndex = Math.min(history.length, historyIndex + 1)
    cmdInput.value =
      historyIndex === history.length ? '' : history[historyIndex]
  }
})