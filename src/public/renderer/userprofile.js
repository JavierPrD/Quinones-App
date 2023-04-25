const jwt = require('jsonwebtoken');
const { ipcRenderer } = require('electron');

// Get the user's JWT token from local storage
const token = localStorage.getItem('token');

// Decode the token to get the user ID
const decodedToken = jwt.decode(token);
const userId = decodedToken.id;
console.log('Sending request to get user info for user ID', userId);
// Send a request to the server to fetch the user profile data
ipcRenderer.send('get-user-info', { userId, token });

// Listen for the response from the server
ipcRenderer.on('user-profile-data', (event, results) => {
  if (results) {
  // Update the HTML elements with the user profile data
  document.querySelector('#FirstName').textContent = results[0].FirstName;
  document.querySelector('#LastName').textContent = results[0].LastName;
  document.querySelector('#username').textContent = results[0].username;
  document.querySelector('#password').textContent = results[0].password;
  document.querySelector('#email').textContent = results[0].email;
  document.querySelector('#role').textContent = results[0].role;
  console.log(results[0].FirstName);
} else {
  console.error('No user data returned');
}
});

ipcRenderer.on('get-user-info-error', (event, message) => {
  // Display an error message if there was a problem getting the user's information
  alert(message);
});

ipcRenderer.on('get-user-info-success', (event, message) => {
  alert(message);
});