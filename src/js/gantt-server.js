var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');

var port = 1337;
var app = express();

app.use(express.static(path.join("public")))
app.use(bodyParser.urlencoded({ extended: true}));

app.listen(port, function(){
    console.log("Server is running on port" +port+"...");
})