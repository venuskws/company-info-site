const express = require("express");
const path = require("path");
const app = express();
const data = require("./data-service.js");


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
        res.json(data);
    })
    .catch((err) => {
        res.json({"message": err}); 
    })

});

app.get("/employees", function(req, res){
    data.getAllEmployees()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message": err});
    })

});

app.get("/departments", function(req, res){
    data.getDepartments()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message": err});
    })

});

app.use((req, res) => {
    res.status(404).send("<img src='https://cdn-images-1.medium.com/max/1600/1*dMtM0XI574DCyD5miIcQYg.png' alt='Page not found' >");
});

data.initialize()
.then(() => {
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(() => {
    console.log("Data not available");
})
