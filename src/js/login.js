const electron = require('electron');
const mysql = require('mysql');

const { remote, ipcRenderer } = electron;
const { BrowserWindow } = remote;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'capstone'
});

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    
    if (results.length > 0) {
      console.log('Login successful');
      ipcRenderer.send('login-successful');
      //openHomePage();
    } else {
      console.log('Login failed');
    }
  });
});

function openHomePage() {
  const homePage = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  homePage.loadFile('Home_view.html');

  homePage.on('closed', () => {
    homePage = null;
  });
}
