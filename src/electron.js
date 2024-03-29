//IMPORTANT DO NOT DELETE THE FOLLOWING ALLOWS FOR USERS IN THE ELECTRON APP
//TO INPUT VALUES THAT ARE SAVED TO THE MYSQL DATABASE DO NOT MESS WITH IPCRENDERER, PRELOAD.JS, AND RENDERER,JS
const { app, BrowserWindow, ipcMain } = require("electron");
const http = require("http");
const path = require("path");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isDev = process.env.NODE_ENV !== "production";
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./js/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./js/utils//users");

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
  loginWindow.loadURL(path.join("file://", __dirname, "html/Login.html"));
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
  profileWindow.loadFile(
    path.join(__dirname, "src/html/UserProfile_view.html")
  );
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

  finalWindow.loadFile("src/html/Sign-up.html");

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
  ganttWindow.loadFile("src/html/Gantt-Chart_view.html");
}

//------------------------------------------------------------------------
app.whenReady().then(() => {
  createMain();
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
});

//---------------------------------------------------------------------------
//MySQL Database Connection
//Do not delete Login will not function without connection
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

//------------------ipcMain------------------------------------------------------------
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

ipcMain.on("login", (event, userData) => {
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
      // verify the password hash
      const user = results[0];
      bcrypt.compare(password, user.password_hash, (err, match) => {
        if (err || !match) {
          return event.sender.send("login-error", {
            error: "Invalid credentials",
          });
        }
        // create a JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          "your_secret_key"
        );
        event.sender.send("login-success", { token });
      });
      event.reply("login-response", userData);
      console.log(`User verified successfully: ${result}`);
      event.reply("login-success", result);
    }
  });
});

ipcMain.on("display-text", (event, text) => {
  mainWindow.webContents.send("display-text", text);
});
//------------------ipcMain------------------------------------------------------------

//-------------Electron App----------------------
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
//-----------------------------------------------

/*Chat Room front-end javascript commands do not delete */
//const express = require("express");

const ap = express();
const server = http.createServer(ap);
const io = socketio(server);

//Set static folder
ap.use(express.static(path.join(__dirname, "public")));

const botName = "Quinones Bot";

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to Quinones Chat"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
