//renderer file but title as register.js
//api has already been declared do not add const{ipcRenderer: api}

api.receive("message-from-main", (data) => {
    console.log(`Received message from main process: ${data}`);
  });
  
  function sendMessageToMain() {
    api.send("message-from-renderer", "Hello from renderer process!");
  }
  
  document
    .getElementById("send-message")
    .addEventListener("click", sendMessageToMain);
  
  
  //-------------IMPORTANT DO NOT DELETE KEEP-------------------
  const registerForm = document.getElementById("register-form");
  function registerUser() {
    const id = document.getElementById("id").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userData = { id, username, email, password };
  
    // Send the user data to the main process
    api.send("register-user", userData);
  }
  
  // Listen for the register button click event
  const registerButton = document.getElementById("register-button");
  registerButton.addEventListener("click", registerUser);
  
  // Listen for the register user response from the main process
  api.receive("register-user-response", (data) => {
    if (data.success) {
      console.log("User registered successfully");
    } else {
      console.error("Error registering user:", data.error);
    }
  });
  //-----------IMPORTANT DO NOT DELETE KEEP--------------
  