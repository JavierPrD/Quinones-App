const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 1337;
const app = express();
 
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.listen(port, () =>{
    console.log("Server is running on port "+port+"...");
});
 
const Promise = require('bluebird');
require("date-format-lite");
 
const mysql = require('promise-mysql');
async function serverСonfig() {
    const db = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'capstone'
    });
    app.get("/data", (req, res) => {
        Promise.all([
            db.query("SELECT * FROM gantt_tasks"),
            db.query("SELECT * FROM gantt_links")
        ]).then(results => {
            let tasks = results[0],
                links = results[1];
 
            for (let i = 0; i < tasks.length; i++) {
              tasks[i].start_date = tasks[i].start_date.format("YYYY-MM-DD hh:mm:ss");
              tasks[i].open = true;
            }
 
            res.send({
                data: tasks,
                collections: { links: links }
            });
 
        }).catch(error => {
            sendResponse(res, "error", null, error);
        });
    });
 
    function sendResponse(res, action, tid, error) {
 
        if (action == "error")
            console.log(error);
 
        let result = {
            action: action
        };
        if (tid !== undefined && tid !== null)
            result.tid = tid;
 
        res.send(result);
    }
};
serverСonfig();