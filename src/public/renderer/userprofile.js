const { ipcRenderer } = require('electron');

// Get the user's JWT token from local storage
const token = localStorage.getItem('token');

// Send a request to the main process to get the user's information from the database
ipcRenderer.send('get-user-info', token);

// Listen for the response from the main process
ipcRenderer.on('user-info', (event, userInfo) => {
  // Get elements from the HTML
  const firstName = document.querySelector('#first-name');
  const lastName = document.querySelector('#last-name');
  const username = document.querySelector('#username');
  const password = document.querySelector('#password');
  const email = document.querySelector('#email');
  const role = document.querySelector('#role');

  // Populate the elements with the user's information
  firstName.innerText = userInfo.FirstName;
  lastName.innerText = userInfo.LastName;
  username.innerText = userInfo.username;
  password.innerText = userInfo.password;
  email.innerText = userInfo.email;
  role.innerText = userInfo.role;

 
  
});

ipcRenderer.on('get-user-info-error', (event, message) => {
  // Display an error message if there was a problem getting the user's information
  alert(message);
});