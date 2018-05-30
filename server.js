var express = require("express");
var path = require("path");
var app = express();
var data = require("./data-service.js");
// testing
//data.initialize();
//data.getAllEmployees();
//

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on port" + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/managers", function(req, res){
    data.getManager()
    .then((data) => {
        /*return JSON data*/
        res.json(data);/////////
    })
    .catch((err) => {
        /* return err message in the JSON format: {message: err}*/
        res.json(err); /////////////
    })
    //res.send("<h3>TODO: get all employees who have isManager==true</h3>");
});

app.get("/employees", function(req, res){
    data.getAllEmployees()
    .then((data) => {
        /*return JSON data*/
        res.json(data);//////////
    })
    .catch((err) => {
        /* return err message in the JSON format: {message: err}*/
        res.json(err); /////////////
    })
    //res.send("<h3>TODO: get all employees</h3>");
});

app.get("/departments", function(req, res){
    data.getDepartments()
    .then((data) => {
        /*return JSON data*/
        res.json(data); ///////////
    })
    .catch((err) => {
        /* return err message in the JSON format: {message: err}*/
        res.json(err); /////////////
    })
    //res.send("<h3>TODO: get all departments</h3>");
});

data.initialize()
.then(() => {
    //start the server
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(() => {
    /*output the error to the console */
    console.log("initialize failed");
})
