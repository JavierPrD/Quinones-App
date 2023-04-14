const { app, BrowserWindow, ipcMain } = require("electron");
const mysql = require("mysql2");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("./src/html/test.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "capstone",
  });

  connection.connect();

  ipcMain.on("get-data", (event) => {
    connection.query("SELECT * FROM user", (error, results) => {
      if (error) {
        throw error;
      }

      event.reply("data", results);
    });
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
