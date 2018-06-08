const fs = require('fs');

var employees = [];
var departments = [];


// This function will read the contents of the "./data/employees.json" file
module.exports.initialize = function() {
    
    return new Promise(function(resolve, reject){
        
        fs.readFile("./data/employees.json", (err, data) => {
            if (err) {
                reject("unable to read file");
                throw err;
            }
            employees = JSON.parse(data);

            fs.readFile("./data/departments.json", (err, data) => {
                if (err) {
                    reject("unable to read file");
                    throw err;
                }
                departments = JSON.parse(data);
            });

            resolve("initializing complete");
            
            });
        });
    
}


module.exports.getAllEmployees = function() {

    return new Promise(function(resolve, reject) {

        if (employees.length == 0) {
            reject("no results returned");
        } else{
            resolve(employees);
        }

    })
    
}



module.exports.getManager = function() {
    var managers = [];

    return new Promise(function(resolve, reject){

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }
        if (managers.length == 0) {
            reject("no results returned");
        } else {
            resolve(managers);
        }
    })

}

module.exports.getDepartments = function() {

    return new Promise(function(resolve, reject) {
        if (departments.length == 0) {
            reject("no results returned");
        } else {
            resolve(departments);
        }
    })

}

/* Assignment 3 */

module.exports.addEmployee = function(employeeData){

    return new Promise(function(resolve, reject) {

        if (employeeData.isManager == undefined) {
            employeeData.isManager = false;
        } else {
            employeeData.isManager = true;
        }

        employeeData.employeeNum = employees.length + 1;

        employees.push(employeeData);

        resolve("Employee added!");

    })
}

module.exports.getEmployeesByStatus = function(status) {

    return new Promise(function(resolve, reject) {
        var statusMet = [];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                statusMet.push(employees[i]);
            }
        }

        if (statusMet.length == 0) {
            reject("no results returned");
        } else {
            resolve(statusMet);
        }

    })
}

module.exports.getEmployeesByDepartment = function(department) {

    return new Promise(function(resolve, reject) {
        var statusMet = [];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                statusMet.push(employees[i]);
            }
        }
        if (statusMet.length == 0) {
            reject("no results returned");
        } else {
            resolve(statusMet);
        }
        
    })
}

module.exports.getEmployeesByManager = function(manager) {

    return new Promise(function(resolve, reject) {
        var statusMet = [];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                statusMet.push(employees[i]);
            }
        }

        if (statusMet.length == 0) {
            reject("no results returned");
        } else {
            resolve(statusMet);
        }
        
    })
}

module.exports.getEmployeeByNum = function(num) {

    return new Promise(function(resolve, reject) {
        var statusMet = [];
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                statusMet.push(employees[i]);
            }
        }

        if (statusMet.length == 0) {
            reject("no results returned");
        } else {
            resolve(statusMet);
        }
        
    })
}
/*              */