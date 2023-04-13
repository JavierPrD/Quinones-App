//IMPORTANT DO NOT DELETE THE FOLLOWING ALLOWS FOR USERS IN THE ELECTRON APP
//TO INPUT VALUES THAT ARE SAVED TO THE MYSQL DATABASE DO NOT MESS WITH IPCRENDERER, PRELOAD.JS, AND RENDERER,JS
const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const mysql = require("mysql");
const isDev = process.env.NODE_ENV !== "production";
const { dbDisplayToApp } = require("../renderer/dbDisplayToApp");


//Displays database content onto electron application front-end
//dbDisplayToApp();

function createMain() {
  const mainWin = new BrowserWindow({
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 60,
    },
    title: "Quinones",
    width: isDev ? 2000 : 500,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (isDev) {
    mainWin.webContents.openDevTools();
  }
  mainWin.loadFile(path.join(__dirname, "../html/Login.html"));
  // When the window is ready, send a message to the userprofile.js process to retrieve the user's information
}

app.whenReady().then(() => {
  //createWindow()
  createMain();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMain();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
    return;
  }
  console.log("Connected to database successfully!");
});


/*DO NOT TOUCH VERY IMPORTANT FOR ELECTRON APP AND DATABASE INTERACTION */
ipcMain.on("message-from-renderer", (event, arg) => {
  console.log(`Received message from renderer process: ${arg}`);
  event.reply("message-from-main", "Hello from main process!");
});

ipcMain.on("register-user", (event, userData) => {
  const { firstName, lastName, username, email, password, role } = userData;

  const query = `INSERT INTO user (firstName, lastName, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [firstName, lastName, username, email, password, role];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.log(`Error inserting user data into database: ${err}`);
      event.reply("register-user-error", err);
      return;
    }
    console.log(`User data inserted successfully: ${result}`);
    event.reply("register-user-success", result);
  });
});


ipcMain.on("verify-user", (event, userData) => {
  const { username, password } = userData;

  const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
  const values = [username, password];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.log(`Error verifying user data in database: ${err}`);
      event.reply("verify-user-error", err);
      return;
    }
    if (result.length === 0) {
      console.log(`User not found or invalid credentials`);
      event.reply(
        "verify-user-failure",
        "User not found or invalid credentials"
      );
    } else {
      console.log(`User verified successfully: ${result}`);
      event.reply("verify-user-success", result);
    }
  });
});
/*DO NOT TOUCH VERY IMPORTANT FOR ELECTRON APP AND DATABASE INTERACTION */

ipcRenderer.send('template-rendered', html);