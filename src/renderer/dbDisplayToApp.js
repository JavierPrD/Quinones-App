const electron = require('electron')
const mysql = require('mysql')
const { app, BrowserWindow } = electron


let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  mainWindow.loadFile('dbDisplayToApp.html')

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

function dbDisplayToApp(){
  const connection = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "capstone",
  });
  connection.connect(function (err) {
    if (err) throw err
    console.log('Connected to MySQL database!')

    connection.query('SELECT * FROM users', function (err, rows, fields) {
      if (err) throw err

      console.log('Table data:', rows)

      mainWindow.webContents.send('tableData', rows)
    })

    connection.end()
  })
}
module.exports = {dbDisplayToApp};