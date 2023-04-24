const { ipcRenderer } = require("electron");
const mysql = require("mysql");
const data = [];

// Connection details for MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

// Connect to MySQL database
connection.connect();

// Retrieve task data from MySQL database
connection.query(
  "SELECT name, startDate, dueDate FROM task",
  (error, results, fields) => {
    if (error) throw error;
    results.forEach((result) => {
      data.push({
        text: result.name,
        start_date: result.startDate,
        end_date: result.dueDate,
      });
    });

    // Initialize and load Scheduler with events
    scheduler.init("scheduler_here", new Date(), "month");
    scheduler.parse(data, "json");
  }
);

scheduler.config.header = [
  "day",
  "week",
  "month",
  "date",
  "prev",
  "today",
  "next",
];

