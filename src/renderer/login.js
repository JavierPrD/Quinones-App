
const { ipcRenderer } = require("electron");

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get username and password input values
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  // Send login request to main process
  ipcRenderer.send('verify-user', { username, password });
});

// Listen for login response from main process
ipcRenderer.on('login-response', (event, userData) => {
  // If userData is null or does not contain FirstName and LastName properties, login failed
  if (!userData) {
    console.log(userData)
    //userData: username: javi, password: pass
    alert('Login failed. Please try again.');
    return;
  }
  // Login succeeded, redirect to home page
  window.location.href = 'Home_view.html';
});

ipcRenderer.on('verify-user-failure', (event, message) => {
  alert(message);
});

ipcRenderer.on('verify-user-error', (event, error) => {
  console.log(error);
  alert('An error occurred while verifying user data. Please try again later.');
});





/*
const { ipcRenderer } = require("electron");

// login form submit event
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  // send login credentials to the main process
  ipcRenderer.send("login", { username, password });
});

const loginButton = document.querySelector("#login-button");
loginButton.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  ipcRenderer.send("protected", { token });
});

ipcRenderer.on("login-response", (event, args) => {
  const { success, token, error } = args;
  if (success) {
    localStorage.setItem("token", token);
    document.querySelector("#login-message").textContent = "Login successful";
  } else {
    document.querySelector("#login-message").textContent = error;
  }
});

ipcRenderer.on("protected-response", (event, args) => {
  const { success, error } = args;
  if (success) {
    // do something with the protected data
  } else {
    document.querySelector("#protected-message").textContent = error;
  }
});

// handle login success
ipcRenderer.on("login-success", (event, args) => {
  const { token } = args;

  // store the JWT in a cookie or local storage
  // ...

  // load the main window
  loginWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "src/html/Login.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // display success message to user
  document.querySelector("#login-message").textContent = "Login successful";
});

// handle login error
ipcRenderer.on("login-error", (event, args) => {
  const { error } = args;

  // display error message to user
  document.querySelector("#login-message").textContent = error;
});

// protected route access event
const protectedButton = document.querySelector("#protected-button");
protectedButton.addEventListener("click", () => {
  const token = localStorage.getItem("token");

  // send request to the main process to access the protected route
  ipcRenderer.send("protected-route-access", { token });
});

// handle protected route success
ipcRenderer.on("protected-route-access-success", (event, args) => {
  // display success message to user
  document.querySelector("#protected-message").textContent = args.message;
});

// handle protected route error
ipcRenderer.on("protected-route-access-error", (event, args) => {
  const { error } = args;

  // display error message to user
  document.querySelector("#protected-message").textContent = error;
});

// listen for main process events
ipcRenderer.on("main-process-message", (event, args) => {
  // handle main process events
  // ...
});
*/