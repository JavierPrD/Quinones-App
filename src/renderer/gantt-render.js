const { ipcRenderer } = require("electron");
const mysql = require("mysql");

// Connection details for MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

// Connect to MySQL database
connection.connect();

// Retrieve user IDs from MySQL database
const users = [];
connection.query(
  "SELECT id, FirstName FROM users",
  (error, results, fields) => {
    if (error) throw error;
    results.forEach((result) => {
      users.push({
        key: result.id,
        label: result.FirstName,
      });
    });
  }
);

// Function to get the user's first name based on the user ID
function getUserFirstName(user_id) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].key == user_id) {
      return users[i].label;
    }
  }
  return "";
}

const phases = [];
connection.query("SELECT id, phase FROM task WHERE phase IN ('Planning', 'Design', 'Development', 'Testing', 'Deployment')", (error, results, fields) => {
  if (error) throw error;
  results.forEach((result) => {
    phases.push({
      key: result.id,
      label: result.phase,
    });
  });
});

function getPhases(user_id) {
  for (var i = 0; i < phases.length; i++) {
    if (phases[i].key == user_id) {
      return phases[i].label;
    }
  }
  return "";
}

gantt.config.columns = [
  //{ name: "text", label: "Task Name", width: "*", tree: true },
  { name: "text", label: "Task Name", width: "*", align: "center" },
  {
    name: "phase",
    label: "Phase",
    align: "center",
    template: function (obj) {
      return getPhases(obj.phase);
    },
  },
  { name: "start_date", label: "Start Date", width: "*", align: "center" },
  { name: "end_date", label: "Due Date", width: "*", align: "center" },
  {
    name: "user_id",
    label: "Assigned To",
    align: "center",
    template: function (obj) {
      return getUserFirstName(obj.user_id);
    },
  },
  // Owners column
  { name: "add", label: "", width: 44 },
];

gantt.templates.lightbox_header = function (start, end, task) {
  return "Add/Edit task";
};

// Configuring lightbox
gantt.config.lightbox.sections = [
  // Owners section, will map to owner_id
  {
    name: "description",
    height: 70,
    map_to: "text",
    type: "textarea",
    focus: true,
  },
  {
    name: "phase",
    height: 22,
    map_to: "phase",
    type: "select",
    options: phases,
    onchange: function (task, value) {
      task.phase = value;
      task.phase = getPhases(value);
    },
  },

  {
    name: "users",
    height: 22,
    map_to: "user_id",
    type: "select",
    options: users,
    onchange: function (task, value) {
      task.user_id = value;
      task.user = getUserFirstName(value);
      //gantt.updateTask(task.id);
    },
  },
  {
    name: "start_end_date",
    height: 72,
    map_to: "auto",
    type: "duration",
    align: "center",
  },

  //{ name: "time", height: 72, map_to: "auto", type: "duration" }
];
gantt.locale.labels.section_users = "Assigned To";
gantt.locale.labels.section_phase = "Phase";
gantt.locale.labels.section_start_end_date = "Start-End Date";

/*
ipcRenderer.invoke("getData").then((data) => {
  if (data) {
    const { tasks } = data;
    gantt.parse({ data: tasks });
  }
});
*/

// Save updated data to local storage
function saveDataToLocalStorage() {
  const data = gantt.serialize();
  localStorage.setItem("ganttData", JSON.stringify(data));
  console.log("Data is saved to local storage");
}

// Load data from local storage or MySQL database
function loadData() {
  const localData = localStorage.getItem("ganttData");
  if (localData) {
    gantt.parse(JSON.parse(localData));
  } else {
    ipcRenderer.send('getData');
  }
  console.log("Data has been loaded from local storage");
}

gantt.init("gantt_here");
loadData();

// Event listener for when a new task is added
gantt.attachEvent("onAfterTaskAdd", function (id, task) {
  // Get the new task data
  const { text, start_date, end_date, phase, user_id } = gantt.getTask(id);

  // Insert the new task data into the MySQL database
  const sql = `INSERT INTO task (name, startDate, dueDate, phase, assignedTo) VALUES (?, ?, ?, ?, ?)`;
  const values = [text, start_date, end_date, phase, user_id];
  connection.query(sql, values, function (error, results, fields) {
    if (error) throw error;
    console.log("New task added to MySQL database");
  });
});

// Save data to local storage on task add/update/delete
gantt.attachEvent("onAfterTaskAdd", saveDataToLocalStorage);
gantt.attachEvent("onAfterTaskUpdate", saveDataToLocalStorage);
gantt.attachEvent("onAfterTaskDelete", saveDataToLocalStorage);
