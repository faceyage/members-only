#! /usr/bin/env node
//!add MONGODB_URI to your .env file
//* Use this file directly to populate database.
//* Use as "node populatedb"

console.log(
  "This script populates some test users, messages to your database. Specified database as .env"
);

require("dotenv").config();
var async = require("async");

const User = require("./models/user");
const Message = require("./models/message");

const bcrypt = require("bcryptjs"); //to encrypt-decrypt passwords

var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const users = [];

function UserCreate(first_name, last_name, username, password, avatar, cb) {
  bcrypt.hash(password, 10, (err, hashedpassword) => {
    if (err) {
      cb(err, null);
      return;
    }

    const user = new User({ first_name, last_name, username, password: hashedpassword, avatar });

    user.save((err) => {
      if (err) {
        cb(err, null);
        return;
      }

      console.log("New User: ", user);
      users.push(user);
      cb(null, user);
    });
  });
}

function MessageCreate(title, message, user, cb) {
  const themessage = new Message({ title, message, user });

  themessage.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }

    cb(null, themessage);
  });
}

//create users
function createUsers(cb) {
  async.series(
    [
      function (callback) {
        UserCreate(
          "Elliot",
          "Alderson",
          "mrrobot",
          "Mq0U6&534vRY",
          "images/fsociety.jpg",
          callback
        );
      },
      function (callback) {
        UserCreate("Jon", "Snow", "jonsnow", "8Jq#!4*22lml", "images/jonsnow.jpg", callback);
      },
      function (callback) {
        UserCreate("Kratos", "Of Sparta", "kratos", "769I7tDh0Gy%", "images/kratos.jpg", callback);
      },
    ],
    //optional callback
    cb
  );
}

//create users
function createMessages(cb) {
  async.series(
    [
      function (callback) {
        MessageCreate("Winter..", "Winter is coming..", users[1], callback);
      },
      function (callback) {
        MessageCreate("God Of War..", "I'm fucking god of war!!", users[2], callback);
      },
      function (callback) {
        MessageCreate("So What..", "So what kratos fuck society!", users[0], callback);
      },
      function (callback) {
        MessageCreate("Winter..", "Winter is coming true enemy is outside!!!", users[1], callback);
      },
      function (callback) {
        MessageCreate("What??", "Shut up boiii!", users[2], callback);
      },
    ],
    //optional callback
    cb
  );
}

async.series(
  [createUsers, createMessages],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("All Done created successfully");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
