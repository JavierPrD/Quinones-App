const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get username and password input values
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  // Send login request to main process
  api.send('verify-user', { username, password });
});

// Listen for login response from main process
api.on('login-response', (event, userData) => {
  // If userData is null, login failed
  if (!userData) {
    alert('Login failed. Please try again.');
    return;
  }

  // Login succeeded, do something with userData
  console.log('User data:', userData);
  // Login succeeded, redirect to home page
  window.location.href = '.html/Home_view.html';
});

api.on('verify-user-failure', (event, message) => {
  alert(message);
});

api.on('verify-user-error', (event, error) => {
  console.log(error);
  alert('An error occurred while verifying user data. Please try again later.');
});