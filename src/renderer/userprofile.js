const jwt = require('jsonwebtoken');
const { ipcRenderer } = require('electron');

// Get the user's JWT token from local storage
const token = localStorage.getItem('token');

// Decode the token to get the user ID
const decodedToken = jwt.decode(token);
const userId = decodedToken.userId;

// Send a request to the server to fetch the user profile data
ipcRenderer.send('get-user-info', { userId, token });

// Listen for the response from the server
ipcRenderer.on('user-profile-data', (event, userData) => {
  // Update the HTML elements with the user profile data
  document.querySelector('#FirstName').textContent = userData.FirstName;
  document.querySelector('#LastName').textContent = userData.LastName;
  
});

ipcRenderer.on('get-user-info-error', (event, message) => {
  // Display an error message if there was a problem getting the user's information
  alert(message);
});

ipcRenderer.on('get-user-info-success', (event, message) => {
  alert(message);
});