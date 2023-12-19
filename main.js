import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = "http://localhost:5173"; // Vite default port

  win.loadURL(startURL);
}

app.whenReady().then(createWindow);
