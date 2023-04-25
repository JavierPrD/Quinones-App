const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const http = require("http");
const path = require("path");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const isDev = process.env.NODE_ENV !== "production";
const socketio = require("socket.io");
const formatMessage = require("./js/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./js/utils//users");

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
    // Generate a JWT for the authenticated user with their role
    const token = jwt.sign(
      {
        id: result[0].id,
        FirstName: result[0].FirstName,
        LastName: result[0].LastName,
        username: result[0].username,
        email: result[0].email,
        role: result[0].role,
      },
      "mysecretkey"
    );
    event.reply("login-response", { token });
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

ipcMain.on('get-user-info', (event, { userId, token }) => {
  // Verify the JWT token
  jwt.verify(token, 'mysecretkey', (error, decodedToken) => {
    if (error) {
      event.reply('get-user-info-error', 'Invalid token');
    } else if (decodedToken.id !== userId) {
      event.reply('get-user-info-error', 'Token does not match user ID');
    } else {
      //event.reply('get-user-info-success', 'Token matches user ID');
      // Fetch the user data from the database
      connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
          event.reply('get-user-info-error', error.message);
        } else {
          // Send the user information back to the renderer process
          event.reply('user-profile-data', results);
        }
      });
    }
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

/*Chat Room front-end javascript commands do not delete */
//const express = require("express");

const server = http.createServer(expServer);
const io = socketio(server);

//Set static folder
expServer.use(express.static(path.join(__dirname, "public")));

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

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 60,
    },
    title: "Quinones",
    width: 2000,
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
