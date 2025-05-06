const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let audioList = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Aqui pode continuar seu socket.io...
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const savePath = path.join(app.getPath('userData'), 'saved-audios.json');

ipcMain.on('salvar-dados', (event, audios) => {
  audioList = audios;
  fs.writeFileSync(savePath, JSON.stringify(audioList, null, 2));
});

ipcMain.handle('carregar-dados', () => {
  if (fs.existsSync(savePath)) {
    return JSON.parse(fs.readFileSync(savePath));
  }
  return [];
});

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Áudios', extensions: ['mp3', 'wav'] }] });
  return result.canceled ? null : result.filePaths[0];
});
