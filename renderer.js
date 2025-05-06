const soundButtons = document.getElementById('sound-buttons');
let selectedOutputDeviceId = null;
const soundsMap = new Map();

async function populateOutputDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const outputDevices = devices.filter(d => d.kind === 'audiooutput');

  const select = document.getElementById('outputDevices');
  outputDevices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.text = device.label || `Dispositivo ${select.length + 1}`;
    select.appendChild(option);
  });

  select.onchange = () => {
    selectedOutputDeviceId = select.value;
  };

  if (outputDevices.length > 0) {
    selectedOutputDeviceId = outputDevices[0].deviceId;
  }
}

async function addAudio() {
  const filePath = await window.electronAPI.selectAudioFile();
  if (!filePath) return;

  const fileName = filePath.split(/[\\/]/).pop();
  soundsMap.set(fileName, filePath);
  createButton(fileName, filePath);
}

function createButton(name, path) {
  const button = document.createElement('button');
  button.innerText = name;
  button.onclick = async () => {
    const audio = new Audio(path);

    try {
      if (selectedOutputDeviceId && audio.setSinkId) {
        await audio.setSinkId(selectedOutputDeviceId);
      }
    } catch (err) {
      console.warn("Erro ao definir dispositivo de saída:", err);
    }

    audio.play();
  };
  soundButtons.appendChild(button);
}

function carregarAudiosSalvos() {
  const salvos = window.electronAPI.carregarDados();
  salvos.then((lista) => {
    if (!lista) return;
    lista.forEach(([nome, caminho]) => {
      soundsMap.set(nome, caminho);
      createButton(nome, caminho);
    });
  });
}

// Salvar ao fechar
window.addEventListener('beforeunload', () => {
  const audioList = Array.from(soundsMap.entries());
  window.electronAPI.salvarDados(audioList, outputDevices);
});

populateOutputDevices();
carregarAudiosSalvos();
