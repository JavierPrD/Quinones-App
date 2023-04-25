const { ipcRenderer } = require("electron");
const jwt = require("jsonwebtoken");
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get username and password input values
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  // Send login request to main process
  ipcRenderer.send("login", { username, password });
});

ipcRenderer.on("login-response", (event, { error, token }) => {
  if (error) {
    return alert(error);
  }

  // Store the JWT token in local storage
  localStorage.setItem("token", token);

  // Get the decoded token
  const decodedToken = jwt.decode(token);

  // Display a welcome message with the user's username and role
  const message = `Welcome, ${decodedToken.username}! You are logged in as a ${decodedToken.role}.`;
  alert(message);

  // Redirect to the appropriate page based on the user's role
  if (decodedToken.role === "admin") {
    window.location.href = "/home";
  } else if (decodedToken.role === "worker") {
    window.location.href = "/home";
  } else if (decodedToken.role === "manager") {
    window.location.href = "/home";
  } else {
    alert("Invalid role");
  }
});

ipcRenderer.on("login-failure", (event, message) => {
  alert(message);
});

ipcRenderer.on("login-error", (event, message) => {
  alert(message);
});

const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  ipcRenderer.send("login", { username, password });
});
