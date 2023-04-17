//IMPORTANT DO NOT DELETE THE FOLLOWING ALLOWS FOR USERS IN THE ELECTRON APP
//TO INPUT VALUES THAT ARE SAVED TO THE MYSQL DATABASE DO NOT MESS WITH IPCRENDERER, PRELOAD.JS, AND RENDERER,JS
const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const http = require("http");
const path = require("path");
const mysql = require("mysql");
const isDev = process.env.NODE_ENV !== "production";
const express = require('express');



 //--------------------------------------------------
 //Gantt-Chart with DHTMLX Node.js
 


//--------------------------------------------------















//Displays database content onto electron application front-end
//const { dbDisplayToApp } = require("../renderer/dbDisplayToApp");
//dbDisplayToApp();

function createMain() {
  const loginWindow = new BrowserWindow({
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
      contextIsolation: false,
      //preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    loginWindow.webContents.openDevTools();
  }
  loginWindow.loadFile("src/html/Login.html");
  // When the window is ready, send a message to the userprofile.js process to retrieve the user's information

  // Create the homepage window
  const homeWindow = new BrowserWindow({
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
      contextIsolation: false,
    },
    show: false, // Don't show the window until the user is authenticated
  });
  // Load the homepage page
  homeWindow.loadFile("src/html/Home_view.html");

  // Add listener for when the user is authenticated
  app.on("authenticated", () => {
    // Show the homepage window
    homeWindow.show();
  });
  // Add listener for when the login window is closed
  loginWindow.on("closed", () => {
    // Close the homepage window if it's still open
    if (!homeWindow.isDestroyed()) {
      homeWindow.close();
    }
  });
  // Add listener for when the login form is submitted
  loginWindow.webContents.on("form-submit", () => {
    // Authenticate the user
    const isValidUser = true; // Implement your authentication logic here

    if (isValidUser) {
      // Send authenticated event to main process
      app.emit("authenticated");
    } else {
      // Show error message in the login window
      loginWindow.webContents.send(
        "show-error-message",
        "Invalid username or password."
      );
    }
  });
}

/*function createTest() {
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
}*/

function createProfile() {
  const profileWindow = new BrowserWindow({
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
      //Keep contextIsolation: false this will allow IPC to render the database content onto the profile page
      contextIsolation: false,
    },
  });
  if (isDev) {
    profileWindow.webContents.openDevTools();
  }
  profileWindow.loadFile(path.join(__dirname, "../html/UserProfile_view.html"));
  // When the window is ready, send a message to the userprofile.js process to retrieve the user's information
}

function createFinal() {
  finalWindow = new BrowserWindow({
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
      //contextIsolation is needed to be set to true always to allow preload.js to be rendered into the application
      contextIsolation: true,
      //preload is require to get the "Register" button in the sign-up page to work
      preload: path.join(__dirname, "preload.js"),
    },
  });

  finalWindow.loadFile("./src/html/Sign-up.html");

  finalWindow.on("closed", function () {
    finalWindow = null;
  });
}

function createGantt() {
  ganttWindow = new BrowserWindow({
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 60,
    },

    width: isDev ? 2000 : 500,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      //contextIsolation is needed to be set to true always to allow preload.js to be rendered into the application
      contextIsolation: false,
    },
  });
  if (isDev) {
    ganttWindow.webContents.openDevTools();
    
  }
  ganttWindow.loadFile("./src/html/Gantt-Chart_view.html");
  //ganttWindow.loadFile("./dhx-gantt-app/public/index.html");
}

//------------------------------------------------------------------------
app.whenReady().then(() => {
  //createMain();
  //createTest();
  //createProfile();
  //createFinal();
  createGantt();

  //Require to render database table into user profile page do not
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
  if (process.platform !== "darwin") app.quit();
});

// Call the function to retrieve data from the database
app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMain();
    //createWindow();
  }
});




//------------------------------------------------------------------------
//HTTP Server For Electron Application
//Server to expose endpoints for the application to interact with
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Local Host display following: Hello, World!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/data",
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (data) => {
    console.log(data.toString());
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
//----------------------------------------------------------------------------
//MySQL Database Connection
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
      // Update the loggedIn flag for the user
      connection.query(
        "UPDATE users SET loggedIn = TRUE WHERE id = ?",
        [userData.id],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log("User logged in successfully");
          }
        }
      );
      event.reply("login-response", userData);
      console.log(`User verified successfully: ${result}`);
      event.reply("verify-user-success", result);
    }
  });
});
/*DO NOT TOUCH VERY IMPORTANT FOR ELECTRON APP AND DATABASE INTERACTION */

ipcMain.on("display-text", (event, text) => {
  mainWindow.webContents.send("display-text", text);
});
