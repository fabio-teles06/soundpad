const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectAudioFile: () => ipcRenderer.invoke('dialog:openFile'),
  salvarDados: (audios) => ipcRenderer.send('salvar-dados', audios),
  carregarDados: () => ipcRenderer.invoke('carregar-dados'),
  onSocketPlayAudio: (callback) => ipcRenderer.on('socket-play-audio', (event, name) => callback(name))
});