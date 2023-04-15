// Get the logout button element
const logoutButton = document.getElementById('logout');

// Add an event listener to the logout button
logoutButton.addEventListener('click', function() {
  // Redirect the user to the login page
  window.location.href = 'Login.html';
});