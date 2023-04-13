//api has already been declared do not add const{ipcRenderer: api}

api.receive("message-from-main", (data) => {
  console.log(`Received message from main process: ${data}`);
});

function sendMessageToMain() {
  api.send("message-from-renderer", "Hello from renderer process!");
}

document
  .getElementById("send-message")
  .addEventListener("click", sendMessageToMain);


//-------------IMPORTANT DO NOT DELETE KEEP-------------------
const registerForm = document.getElementById("register-form");
function registerUser() {
  const id = document.getElementById("id").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userData = { id, username, email, password };

  // Send the user data to the main process
  api.send("register-user", userData);
}

// Listen for the register button click event
const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", registerUser);

// Listen for the register user response from the main process
api.receive("register-user-response", (data) => {
  if (data.success) {
    console.log("User registered successfully");
  } else {
    console.error("Error registering user:", data.error);
  }
});
//-----------IMPORTANT DO NOT DELETE KEEP--------------


// Listen for messages from main process
api.receive("login-reply", data => {
  if (data.successful) {
    console.log("Login successful");
    openHomePage();
  } else {
    console.log("Login failed");
  }
});

// Send message to main process
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const credentials = { username, password };
  api.send("login", credentials);
}

// Listen for click event on login button
document.getElementById("login-button").addEventListener("click", login);

// Open home page
function openHomePage() {
  const { BrowserWindow } = require("electron").remote;
  const homePage = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  homePage.loadFile("./html/Home_view.html");

  homePage.on("closed", function () {
    homePage = null;
  });
}