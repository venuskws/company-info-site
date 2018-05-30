const fs = require('fs');

var employees = {};
var departments = {};


// This function will read the contents of the "./data/employees.json" file
module.exports.initialize = function() {
    
    return new Promise(function(resolve, reject){
        fs.readFile("./data/employees.json", (err, data) => {
            if (err) throw err;
            employees = JSON.parse(data);
            fs.readFile("./data/departments.json", (err, data) => {
                if (err) throw err;
                departments = JSON.parse(data);
            });
            resolve("initializing complete");
            });
        });
    

    /*
    function outputB(msg) {
        return new Promise(function(resolve, reject){
            //initializeDepartments();
            //console.log("outputB" + departments);
            
            fs.readFile("./data/departments.json", (err, data) => {
                if (err) throw err;
                departments = JSON.parse(data);
            });
            resolve("outputB() complete");//should be inside previous step?
        })
    }
    */
    /*function outputB(msg) {
        fs.readFile("./data/departments.json", (err, data) => {
            if (err) throw err;
            departments = JSON.parse('' + data);
        });

        return new Promise(function(resolve, reject){
            console.log('2' + departments);
            resolve("outputB() complete");
        })
    }*/
/*
        var promiseParseEmployeeData = new Promise(function(resolve, reject){
            fs.readFile("./data/departments.json", (err, data) => {
                if (err) throw err;
                // console.log('' + data);
                employees = JSON.parse('' + data);
                if (employees > 0) {
                    resolve();
                } 
                else {
                    reject("not successful");
                }
            });
            // employees = JSON.parse(file);
            // var json = '[{"result":true, "count":42}]';
            // obj = JSON.parse(json);
            // console.log('hellow ' + file);

        });

        var promiseParseDepartmentData = new Promise(function(resolve, reject){

            // departments = JSON.parse(fs.readFile("./data/departments.json", (err, data) => {
            //     if (err) throw err;
            //     console.log(data);
            // }));
            if (departments > 0) {
                resolve();
            } else {
                reject();
            }
        });
        
        promiseParseEmployeeData.then(promiseParseDepartmentData)
        .catch(function(reason) {
            console.log(reason):
        });
*/
/*
    outputA()
    .then(function() {
        console.log("initialize resolved!");
    })
    .catch(function(rejectMsg){
            console.log('unable to read file' + rejectMsg);
    });
*/
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