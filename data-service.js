const Sequelize = require('sequelize');

var sequelize = new Sequelize('d6hkpav664258s', 'zrshxlzcukisjc', 'd73110b2bddbca2d9790d9144e6fbf4efbcfcf36023c66207d870ea7712bbc4c', {
    host: 'ec2-54-163-235-56.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})



// This function will read the contents of the "./data/employees.json" file
module.exports.initialize = function() {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            resolve("success!");
        }).catch(function(error){
            reject("unable to sync the database");
        })
});
  
}


module.exports.getAllEmployees = function() {

    return new Promise(function (resolve, reject) {
        Employee.findAll()
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })

});
}



module.exports.getManager = function() {

    return new Promise(function (resolve, reject) {
        reject();
});
/*
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
*/

}

module.exports.getDepartments = function() {

    return new Promise(function (resolve, reject) {
        Department.findAll()
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}

/* Assignment 3 */

module.exports.addEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for (var i in employeeData) {
        if (employeeData.i == "") {
            employeeData.i = null;
        }
    }

    return new Promise(function (resolve, reject) {
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        })
        .then(function(employee){
            resolve("success");
        })
        .catch(function(error){
            reject("unable to create employee");
        })
});

}

module.exports.addDepartment = function(departmentData) {

    for (var i in departmentData) {
        if (departmentData.i == "") {
            departmentData.i = null;
        }
    }

    return new Promise(function(resolve, reject) {
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        })
        .then(function(data){
            resolve("Success");
        })
        .catch(function(error){
            reject("unable to create department");
        })
    });

}


module.exports.getEmployeesByStatus = function(stts) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: stts
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })

});
}

module.exports.getEmployeesByDepartment = function(dept) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: dept
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}

module.exports.getEmployeesByManager = function(mng) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{
                employeeManagerNum: mng
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(data){
            reject("no results returned");
        })
});

}

module.exports.getEmployeeByNum = function(num) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{
                employeeNum: num
            }
        })
        .then(function(data){
            resolve(data[0]);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}
/*              */

/* Assignment 4 */
module.exports.updateEmployee = function(employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for (var i in employeeData) {
        if (employeeData.i == "") {
            employeeData.i = null;
        }
    }

    return new Promise(function (resolve, reject) {
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        },{
            where:{
                employeeNum: employeeData.employeeNum
            }
        })
        .then(function(data){
            resolve("success");
        })
        .catch(function(data){
            reject("unable to update employee");
        })
});

}
/*              */

/* Assignment 5 */
module.exports.updateDepartment = function(departmentData) {

    for (var i in departmentData) {
        if (departmentData.i == "") {
            departmentData.i = null;
        }
    }

    return new Promise(function(resolve, reject) {
        Department.update({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }, {
            where: {
                departmentId: departmentData.departmentId
            }
        })
        .then(function(data) {
            resolve("Success!");
        })
        .catch(function(data) {
            reject("unable to update department");
        })
    });

}

module.exports.getDepartmentById = function(id) {
    
    return new Promise(function(resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
        })
        .then(function(data) {
            resolve(data[0]);
        })
        .catch(function(error) {
            reject("no results returned");
        })
    });

}

module.exports.deleteEmployeeByNum = function(empNum) {

    return new Promise(function(resolve, reject) {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        })
        .then(function() {
            resolve("destroyed!");
        })
        .catch(function(error){
            reject("Unable to delete employee");
        })
    });

}
/*              */
