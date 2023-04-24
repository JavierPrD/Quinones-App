const electron = require('electron')
const mysql = require('mysql')
const { app, BrowserWindow } = electron
/*
const mssql = require("mssql");


const config = {
  user: "sa",
  password: "password",
  server: "JAVIER-GAMING\\SQLEXPRESS",
  database: "USER_PROJECT_TASK",
  port: 1433,
  encrypt: false,
};


function connectToDatabase(){
    const db = new mssql.ConnectionPool(config);
// Connect to the database.
db.connect()
  .then(() => {
    console.log("Connected to the database.");
    // Execute a SQL query.
    db.request()
      .query("SELECT * FROM [User]")
      .then((result) => {
        // Process the query results.
        console.log(result.recordset);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

}
*/

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js'
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function connectToDatabase(){
  const connection = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "user_task_project",
  });
  connection.connect(function (err) {
    if (err) throw err
    console.log('Connected to MySQL database!')

    connection.query('SELECT * FROM user', function (err, rows, fields) {
      if (err) throw err

      console.log('Table data:', rows)

      mainWindow.webContents.send('tableData', rows)
    })

    connection.end()
  })
}
module.exports = {connectToDatabase};
