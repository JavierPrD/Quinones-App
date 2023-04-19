const path = require("path");
const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Create a connection pool
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "capstone",
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
})

//set view files
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




app.get("/", (req, res) => {
  //res.send("What is this?");
  let sql = "SELECT * FROM capstone.task";
  let query = connection.query(sql, (err, rows) => {
    if(err) throw err;
    res.render('user_index', {
        title: 'Task Table',
        user: rows
    });
  });
});

//Server listening
app.listen(2998, () => {
  console.log("Server is running on port 2998");
});