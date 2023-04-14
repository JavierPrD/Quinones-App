const mysql = require("mysql");
const { ipcRenderer } = require('electron');

// create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

// connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// define a SQL query to get the user names and roles from the database
const query = "SELECT username, role FROM user";

// execute the SQL query and get the results
connection.query(query, (err, results) => {
  if (err) throw err;

  // render the HTML for the homepage
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Home</title>
    </head>
    <body>
      <h1>Project Roster</h1>
      <ul>
        ${results
          .map((result) => `<li>${result.username} - ${result.role}</li>`)
          .join("")}
      </ul>
    </body>
    </html>
  `;

  console.log(html); // or send the HTML to the client using res.send() if you're using a web framework like Express.js
});

// close the database connection
connection.end((err) => {
  if (err) throw err;
  console.log("Disconnected from the database!");
});


ipcRenderer.on('display-text', (event, text) => {
    const displayTextElement = document.getElementById('display-text');
    displayTextElement.textContent = text;
  });