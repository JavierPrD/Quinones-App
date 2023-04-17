const { ipcRenderer } = require('electron');
const gantt = require('dhtmlx-gantt');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'capstone',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }

  console.log('Connected to MySQL database');
});

gantt.config.xml_date = '%Y-%m-%d %H:%i:%s';
gantt.init('gantt_here');

ipcRenderer.on('load-data', (event, args) => {
  connection.query('SELECT * FROM gantt-tasks', (error, results, fields) => {
    if (error) {
      console.error('Error loading data from MySQL database:', error.stack);
      return;
    }

    const tasks = [];

    results.forEach((result) => {
      tasks.push({
        id: result.id,
        text: result.text,
        start_date: result.start_date,
        end_date: result.end_date,
        progress: result.progress,
      });
    });

    gantt.parse({ data: tasks });
  });
});
