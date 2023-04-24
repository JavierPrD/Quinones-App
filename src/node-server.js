const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

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

expServer.post("/register", function (req, res) {
  const { username, password } = req.body;
  connection.query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`,
    function (err, result) {
      if (err) throw err;
      res.send("User registered successfully");
    }
  );
});

expServer.post("/login", function (req, res) {
  const { username, password } = req.body;
  connection.query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`,
    function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        res.status(401).send("Invalid username or password");
      } else {
        const token = jwt.sign({ username }, "secret_key");
        res.cookie("token", token, { httpOnly: true });
        res.send("User authenticated successfully");
      }
    }
  );
});

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send("No token provided");
  }
  jwt.verify(token, "secret_key", function (err, decoded) {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.username = decoded.username;
    next();
  });
}

server.get("/protected", verifyToken, function (req, res) {
  res.send("This route is protected");
});

const mainWindow = new BrowserWindow({
  width: isDev ? 2000 : 500,
  height: 1000,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});

ipcMain.on("login", (event, args) => {
  // Send login credentials to server
  // Retrieve and store JWT
});

ipcMain.on("protected", (event, args) => {
  // Send request to protected route
  // Display response in renderer process
});

mainWindow.loadFile("index.html");
