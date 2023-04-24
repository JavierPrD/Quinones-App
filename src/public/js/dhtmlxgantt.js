function getUser(user_id) {
  for (var i = 0; i < users.length; i++) {
      if (users[i].key == user_id) {
          return users[i].label;
      }
  }
  return "";
}

var users = [];

function getUsersFromDb() {
  fetch('/users')
      .then(res => res.json())
      .then(data => {
          users = data;
          gantt.templates.user_id = function (item) {
              return getUser(item.user_id);
          };
          gantt.config.lightbox.sections = [
              {
                  name: "users",
                  height: 22,
                  map_to: "user_id",
                  type: "select",
                  options: users
              },
              {
                  name: "description",
                  height: 70,
                  map_to: "text",
                  type: "textarea",
                  focus: true
              },
              {
                  name: "time",
                  height: 72,
                  map_to: "auto",
                  type: "duration"
              }
          ];
          gantt.init("gantt_here");
          gantt.parse(tasks);
      })
      .catch(err => console.log(err));
}

function getUsersFromDb() {
  fetch('/users')
      .then(res => res.json())
      .then(data => {
          users = data;
          gantt.templates.user_id = function (item) {
              return getUser(item.user_id);
          };
          gantt.config.lightbox.sections = [
              {
                  name: "users",
                  height: 22,
                  map_to: "user_id",
                  type: "select",
                  options: users
              },
              {
                  name: "description",
                  height: 70,
                  map_to: "text",
                  type: "textarea",
                  focus: true
              },
              {
                  name: "time",
                  height: 72,
                  map_to: "auto",
                  type: "duration"
              }
          ];
          gantt.init("gantt_here");
          gantt.parse(tasks);
      })
      .catch(err => console.log(err));
}

// Function to connect to the database
function connectToDatabase() {
  const mysql = require('mysql');
  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'capstone'
  });

  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected to database!");
  });

  // Query to retrieve users from the database
  const query = 'SELECT * FROM users';
  connection.query(query, function(err, result) {
      if (err) throw err;
      // Store the retrieved users in the users variable
      users = result.map(user => {
          return { key: user.id, label: user.name };
      });
      // Call the getUsersFromDb function to initialize the Gantt chart
      getUsersFromDb();
  });

  connection.end();
}

connectToDatabase();
