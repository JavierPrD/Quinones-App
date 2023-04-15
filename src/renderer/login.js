
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
// Get login form element
const loginForm = document.querySelector('#login-form');

// Add submit event listener to login form
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get form data
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  // Query the database for user information
  const rows = await query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);

  // Check if user's credentials are valid
  if (rows.length === 1) {
    // Set session or token to keep user authenticated
    // ...
    // Redirect to homepage
    window.location.href = 'Home_view.html';
  } else {
    // Show error message
    const errorMessage = document.querySelector('#error-message');
    errorMessage.textContent = 'Invalid username or password.';
  }
});
*/