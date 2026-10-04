const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Standard Chrome Desktop User-Agent string to bypass OAuth/Cloudflare anti-bot blocks
const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'AI Multi-Hub Desktop',
    backgroundColor: '#0b0f19',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Inject Chrome Desktop User-Agent into all outgoing headers for defaultSession and webviews
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = CHROME_DESKTOP_UA;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Set default User-Agent for defaultSession
  session.defaultSession.setUserAgent(CHROME_DESKTOP_UA);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
