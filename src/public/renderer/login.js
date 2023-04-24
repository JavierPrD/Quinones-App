const { ipcRenderer } = require("electron");

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get username and password input values
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  // Send login request to main process
  ipcRenderer.send('login', { username, password });
});

// Listen for login response from main process
ipcRenderer.on('login-response', (event, userData) => {
  // If userData is null or does not contain FirstName and LastName properties, login failed
  if (!userData) {
    console.log(userData)
    alert('Login failed. Please try again.');
    return;
  }
  // Login succeeded, redirect to home page
  //window.location.href = 'Home_view.html';
  alert('Welecome');
  window.location.href = '/home';
});

ipcRenderer.on('login-failure', (event, message) => {
  alert(message);
});

ipcRenderer.on('login-error', (event, message) => {
  alert(message);
});

