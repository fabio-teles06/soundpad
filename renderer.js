const soundButtons = document.getElementById('sound-buttons');

async function addAudio() {
  const filePath = await window.electronAPI.selectAudioFile();
  if (!filePath) return;

  const fileName = filePath.split(/[\\/]/).pop();
  createButton(fileName, filePath);
}

function createButton(name, path) {
  const button = document.createElement('button');
  button.innerText = name;
  button.onclick = () => {
    const audio = new Audio(path);
    audio.play();
  };
  soundButtons.appendChild(button);
}
