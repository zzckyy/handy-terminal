const { exec } = require('child_process')
const output = document.getElementById('output')
const cmdInput = document.getElementById('cmd')

cmdInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    const command = cmdInput.value
    output.innerHTML += `> ${command}\n`
    exec(command, (err, stdout, stderr) => {
      if(err) output.innerHTML += `Error: ${err.message}\n`
      if(stderr) output.innerHTML += `${stderr}\n`
      if(stdout) output.innerHTML += `${stdout}\n`
      output.scrollTop = output.scrollHeight
    })
    cmdInput.value = ''
  }
})