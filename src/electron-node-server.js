const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const isDev = process.env.NODE_ENV !== "production";

//Node.JS Server Code
//Node.js server is set up using Express to handle requests from the Electron application.
// IPC is used communicate between the main process and the renderer process.
const expServer = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database");
});

// Serve static files from the public directory
expServer.use(express.static(path.join(__dirname, "public")));
console.log(__dirname);

//Define Routes
expServer.use("/", require("./routes/pages"));

expServer.listen(5000, () => {
  console.log("Server started on Port 5000");
});

ipcMain.on("login", (event, userData) => {
  // Send login credentials to server
  // Retrieve and store JWT
  const { username, password } = userData;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const values = [username, password];
  connection.query(query, values, (err, result, results) => {
    if (err) {
      console.log(`Error verifying user data in database: ${err}`);
      event.reply("login-error", err);
      return;
    }
    if (result.length === 0) {
      console.log(`User not found or invalid credentials`);
      event.reply("login-failure", "User not found or invalid credentials");
    } 
    
      event.reply("login-response", userData);
      console.log(`User verified successfully: ${result}`);
      
  });
});

ipcMain.on("get-data", (event) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    event.reply("data", results);
  });
});

ipcMain.on("get-task", (event) => {
  connection.query(
    "SELECT task.name, task.phase, task.startDate, task.dueDate, users.FirstName FROM task INNER JOIN users ON task.assignedTo = users.id",
    (error, results) => {
      if (error) {
        throw error;
      }
      event.reply("task", results);
    }
  );
});

// Listen for the getData event from the renderer process
ipcMain.on("getData", (event) => {
  // Retrieve the data from the MySQL database
  const sql = `SELECT * FROM task`;
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    // Send the data to the renderer process
    event.sender.send("getData", results);
  });
});

// Listen for the saveDataToLocalStorage event from the renderer process
ipcMain.on("saveDataToLocalStorage", (event, data) => {
  // Save the data to local storage
  localStorage.setItem("ganttData", JSON.stringify(data));
});

ipcMain.on("message-from-renderer", (event, arg) => {
  console.log(`Received message from renderer process: ${arg}`);
  event.reply("message-from-main", "Hello from main process!");
});

ipcMain.on("register-user", (event, userData) => {
  const { firstName, lastName, username, email, password, role } = userData;
  const query = `INSERT INTO users (firstName, lastName, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
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

ipcMain.on("display-text", (event, text) => {
  mainWindow.webContents.send("display-text", text);
});



function createWindow() {
  mainWindow = new BrowserWindow({
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
      contextIsolation: false, // Required for IPC
    },
  });

  mainWindow.loadURL("http://localhost:5000");


  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", function () {
  createWindow();
});
