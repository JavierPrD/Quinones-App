
const { ipcRenderer } = require('electron');


ipcRenderer.receive("message-from-main", (data) => {
  console.log(`Received message from main process: ${data}`);
});

function sendMessageToMain() {
  ipcRenderer.send("message-from-renderer", "Hello from renderer process!");
}

document.getElementById("send-message").addEventListener("click", sendMessageToMain);

const registerForm = document.getElementById("register-form");

function registerUser() {
  const userData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  ipcRenderer.send("register-user", userData);
}

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", registerUser);

ipcRenderer.receive("register-user-response", (data) => {
  if (data.success) {
    console.log("User registered successfully");
  } else {
    console.error("Error registering user:", data.error);
  }
});

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

const cancelButton = document.querySelector(".cancelbtn");
cancelButton.addEventListener("click", () => {
  window.history.back();
});
