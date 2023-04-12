
//IMPORTANT DO NOT DELETE THE FOLLOWING ALLOWS FOR USERS IN THE ELECTRON APP
//TO INPUT VALUES THAT ARE SAVED TO THE MYSQL DATABASE DO NOT MESS WITH IPCRENDERER, PRELOAD.JS, AND RENDERER,JS
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mysql = require('mysql');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('./index.html')
  
  /*
  mainWindow.webContents.on('did-finish-load', () => {
    const connection = mysql.createConnection({
      host: 'localhost',
     user: 'root',
    password: 'password',
    //database: 'quinones'
    database: 'capstone'
    });

    connection.connect((err) => {
      if (err) {
        console.log('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL successfully!');
    });

    mainWindow.webContents.send('mysql-connection', connection);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  */
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})




















/*DO NOT TOUCH VERY IMPORTANT FOR ELECTRON APP AND DATABASE INTERACTION */
ipcMain.on('message-from-renderer', (event, arg) => {
  console.log(`Received message from renderer process: ${arg}`);
  event.reply('message-from-main', 'Hello from main process!');
})

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'capstone'
});

connection.connect((err) => {
  if (err) {
    console.log(`Error connecting to database: ${err}`);
    return;
  }
  console.log('Connected to database successfully!');
});
ipcMain.on('register-user', (event, userData) => {
  const { id, username, email, password } = userData;

  const query = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
  const values = [id, username, email, password];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.log(`Error inserting user data into database: ${err}`);
      event.reply('register-user-error', err);
      return;
    }
    console.log(`User data inserted successfully: ${result}`);
    event.reply('register-user-success', result);
  });
});
