const socket = io("http://localhost:5000");

// Get the username from the login page
const username = localStorage.getItem("username");

//Front-end Javascript File
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Send a chat message when the form is submitted
const form = document.getElementById("chat-feature-form");
const input = document.getElementById("msg");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = input.value;

  // Send the chat message to the server
  socket.emit("chatMessage", message);

  // Clear the input field
  input.value = "";
});

// Listen for the 'message' event and add the message to the message list
const messageList = document.querySelector(".chat-feature-messages");
socket.on("message", (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
});

// Listen for the 'roomUsers' event and update the user list
socket.on("roomUsers", ({ room, users }) => {
  userList.innerHTML = "";
  document.getElementById("room-name").innerText = room;
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
});

// Send the username and join the default room to the server when the user logs in
socket.emit("login", username);
socket.emit("joinRoom", "General");


