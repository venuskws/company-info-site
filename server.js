/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Weisi Kong Student ID: 125400176 Date: July 3, 2018
*
*  Online (Heroku) Link: https://infinite-brook-17692.herokuapp.com/
*
********************************************************************************/


const express = require("express");
const path = require("path");
const app = express();
const data = require("./data-service.js");
const multer = require("multer");
const fs = require('fs');
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

/* Assignment 4 */
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');
//This will add the property "activeRoute" to "app.locals" whenever the route changes
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
/*           */


var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on port" + HTTP_PORT);
}


/* Assignment 3 */
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect('/images');
});

function getFileListing() {
    return new Promise(function (resolve, reject) {
        var data = [];
        fs.readdir('public/images/uploaded', (err, items) => {
            for (var i = 0; i < items.length; i++) {
                data.push(items[i]);
            }
            if (err) {
                reject("there is an error");
            }
            resolve(data);
        });
    });
}

app.get("/images", (req, res) => {

    getFileListing()
        .then((data) => {
            console.log(data);
            res.render("images", {
                data: data});
            //res.json({ "images": data });
        })
        .catch((err) => {
            res.json({ "message": err });
        })
});
/*          */

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.render('home', {
    });
});

app.get("/about", function (req, res) {
    res.render('about', {
    });
});

app.get("/managers", function (req, res) {
    data.getManager()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ "message": err });
        })

});

app.get("/employees", function (req, res) {

    data.getAllEmployees()
        .then(
            (employees) => {

                if (req.query.status) {
                    return data.getEmployeesByStatus(req.query.status);
                }

                else if (req.query.department) {
                    return data.getEmployeesByDepartment(req.query.department);
                }

                else if (req.query.manager) {
                    return data.getEmployeesByManager(req.query.manager);
                }

                else {
                    return employees;
                }
            }
        )
        .then((employees) => {
            if (employees.length > 0){
                res.render("employees", {
                    employees: employees});
            } else {
                res.render("employees", {
                    message: "no results"
                });
            }
        })
        .catch((err) => {
            res.render({message: "failure to get employees data"});
        })

});

app.get("/departments", function (req, res) {
    data.getDepartments()
        .then((departments) => {
            if (departments.length > 0) {
                res.render("departments", {
                    departments: departments
                });
            } else {
                console.log("yay!");
                res.render("departments", {
                    message: "no results"
                });
            }
            
        })
        .catch((err) => {
            res.render({message: "failure to get departments data"});
        })

});

/* Assignment 3&5 */
app.get("/employees/add", function (req, res) {
    data.getDepartments()
    .then(function(data) {
        res.render('addEmployee', {
            departments:data
        });
    })
    .catch(function(error) {
        res.render('addEmployee', {
            departments: []
        });
    })
});

app.get("/images/add", function (req, res) {
    res.render('addImage', {

    });
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Unable to add the employee");
        })
});

/* Assignment 4 */
app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch((err) => {
        res.json({ "message": err });
    })
    
});
/*             */

app.get("/employee/:employeeNum", function (req, res) {
    // initialize an empty object to store the values
    let viewData = {};

    data.getEmployeeByNum(req.params.employeeNum)
        .then((data) => {
            if (data) {
                viewData.employee = data;
            } else {
                viewData.employee = null;
            }         
        })
        .catch(() => {
            viewData.employee = null;
        })
        .then(data.getDepartments())
        .catch((err) => {
            res.status(500).send("Something went wrong");
        })
        .then((data) => {
            viewData.departments = data;
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.departmentId){
                    viewData.departments[i].selected = true;
                }
            }
        })
        .catch(()=> {
            viewData.departments = [];
        })
        .then(() => {
            if (viewData.employee == null) {
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", {
                    viewData: viewData
                });
            }
        })
        .catch((err) => {
            res.status(500).send("Something went wrong");
        })
});
/*              */

/* Assignment 5 */
app.get("/departments/add", function(req, res) {
    res.render('addDepartment', {

    });
});

app.post("/departments/add", function(req, res) {
    data.addDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post("/department/update", function(req, res) {
    data.updateDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    })
    .catch((err) => {
        res.json({ "message": err });
    })
});

app.get("/department/:departmentId", function (req, res) {
    data.getDepartmentById(req.params.departmentId)
        .then((data) => {
            console.log(data.dataValues);
            if (data) {
                res.render("department", {
                    department: data.dataValues
                });
            } else {
                res.status(404).send("Department Not Found");
            }          
        })
        .catch((err) => {
            res.status(404).send("Department Not Found");
        })
});

app.get("/employees/delete/:empNum", function(req, res){
    data.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
        res.redirect("/employees");
    })
    .catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
});
/*              */


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
