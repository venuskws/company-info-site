const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": {
        //[{"dateTime": Date, "userAgent": String}]
        //"type": Array,
        //"property": {"dateTime": Date, "userAgent": String}
        "type": [{dateTime: Date, userAgent: String}]
    }
});

let User;// to be defined on new connection (see initialize)
var connectionString = 'mongodb://mongoDB2_web322:123456abc@ds149279.mlab.com:49279/web322_a6';

module.exports.initialize = function() {
    return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection(connectionString);

        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function(resolve, reject){
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } 
        let newUser = new User(userData);
        //newUser.save();
        //resolve();
        
        new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(newUser.password, salt, function(err, hash) { // encrypt the password: "myPassword123"
                    if (err) {
                        reject(err);
                    } else {
                        newUser.password = hash; // TODO: Store the resulting "hash" value in the DB
                        resolve();
                    }
                });
            })
        })
        .then(() => {
            return new Promise(function(resolve, reject) {
                newUser.save();
                resolve();
                if (err) {
                    if (err.code === 11000) {
                        reject("Username already taken");
                    } else {
                        reject("There was an error creating the user:"  + err);
                    }
                }
            })
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
        
    });
    
};

var passwordValid = function(candidatePassword, hashedPassword, cb) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(candidatePassword, hashedPassword, function(err, isMatched){
            if (err) {
                throw err;
                reject(err);
            }
            console.log(isMatched);
            resolve(isMatched);
            //return cb(null, isMatched);
        });
    })
    /*
    bcrypt.hash(inputPassword, 10)
    .then((hash) => {
        bcrypt.compare(password, hash)
        .then((res) => {
            console.log(res);
            //console.log(password);
            //console.log(hash);
            return res;
        })
    })
    .catch((err) => {
        console.log("1");
        return false;
    })
    */
}
module.exports.checkUser = function(userData){
    return new Promise(function(resolve, reject) {
        User.find(
            {userName: userData.userName}
        )
        .exec()
        .then((users) => {
            //console.log(users);
            var use = users;
            var correct;
            passwordValid(userData.password, users[0].password)
            .then(function(v) {
                console.log(v);
                correct = v;
            })
            .catch((err) => {
                console.log(err);
            })
            .then((result) => {
                //console.log(correct);
                if (users.length == 0) {
                    reject("Unable to find user: " + userData.userName);
                //} else if (users[0].password != userData.password) {
                } else if (!correct) {
                    console.log(users[0].password);
                    console.log(userData.password);
                    reject("Incorrect Password for user: " + userData.userName);
                } else {
                    console.log(passwordValid(userData.password, users[0].password, function(err, match) {
                        return match;
                    }));
                    users[0].loginHistory.push(
                        {dateTime: (new Date()).toString(),
                        userAgent: userData.userAgent}
                    );
                    User.update(
                        {userName: users[0].userName},
                        {$set: {loginHistory: users[0].loginHistory}},
                    ).exec()
                    .then(()=>{
                        console.log("dhah");
                        resolve(users[0]);
                    })
                    .catch((err)=>{
                        reject("There was an error verifying the user: " + err);
                    });
                }
            })
            
         })
         .catch((err) => {
             reject("Unable to find user: " + userData.user + err);
         })
    });
}