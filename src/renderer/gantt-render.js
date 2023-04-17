const mysql = require('mysql');
const gantt = require('dhtmlx-gantt');

// Connect to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'capstone'
});

// Retrieve Gantt chart data from MySQL database
connection.query('SELECT * FROM gantt-tasks', (error, results) => {
  if (error) throw error;
  
  // Parse Gantt chart data using dhtmlx-gantt API
  gantt.parse({data: results});

  // Initialize and render Gantt chart
  gantt.init('gantt_here');
  gantt.render();
});
