const { ipcRenderer } = require("electron");

ipcRenderer.on("message-from-main", (event, data) => {
  console.log(`Received message from main process: ${data}`);
});

function sendMessageToMain() {
  ipcRenderer.send("message-from-renderer", "Hello from renderer process!");
}

document
  .getElementById("send-message")
  .addEventListener("click", sendMessageToMain);

const registerForm = document.getElementById("register-form");

function registerUser() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const userData = { firstName, lastName, username, email, password, role };

  // Send the user data to the main process
  ipcRenderer.send("register-user", userData);
}

// Listen for the register button click event
const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", registerUser);

// Listen for the register user response from the main process
ipcRenderer.on("register-user-response", (event, data) => {
  if (data.success) {
    console.log("User registered successfully");
  } else {
    console.error("Error registering user:", data.error);
  }
});

// Add a dropdown button for the user's role
const roleSelect = document.createElement("select");
roleSelect.setAttribute("id", "role");
roleSelect.setAttribute("name", "role");
const roles = ["Admin", "Manager", "Worker"];
for (let i = 0; i < roles.length; i++) {
  const option = document.createElement("option");
  option.setAttribute("value", roles[i]);
  option.text = roles[i];
  roleSelect.appendChild(option);
}
registerForm.insertBefore(
  roleSelect,
  document.getElementById("register-button")
);

// Add event listener to cancel button
const cancelButton = document.querySelector(".cancelbtn");
cancelButton.addEventListener("click", () => {
  window.history.back();
});
