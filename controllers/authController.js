//models
const User = require("../models/user");
//required third-party modules
//to validate form inputs
const { body, validationResult } = require("express-validator");

//Authentication Modules
const bcrypt = require("bcryptjs"); //to encrypt-decrypt passwords
const passport = require("passport"); //to keep user authenticated (session etc) and other authentication stuff .
const LocalStrategy = require("passport-local").Strategy;

exports.sign_up_get = (req, res) => {
  res.render("sign_up", {
    title: "Sign Up",
  });
};

exports.sign_up_post = [
  body("first_name", "first name must be specified").trim().isLength({ min: 1 }).escape(),
  body("last_name", "last name must be specified").trim().isLength({ min: 1 }).escape(),
  body("username", "username must be specified").trim().isLength({ min: 6 }).escape(),
  body("password", "password must be specified").trim().isLength({ min: 8 }).escape(),
  body("password_confirmation", "password confirmation must be specified")
    .trim()
    .isLength({ min: 8 })
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      //passwords match
      return true;
    })
    .escape(),
  body("avatar", "avatar must be specified").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);
    //there are errors don't save the user
    if (!errors.isEmpty()) {
      //re-render page with errors
      res.render("sign_up", {
        title: "Sign Up",
        errors: errors.array(),
      });

      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      //no error store User in db
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        avatar: req.body.avatar,
      });

      user.save((err) => {
        if (err) return next(err);

        //saved user successfully. so redirect to homepage
        res.redirect("/");
      });
    });
  },
];

exports.login_get = (req, res) => {
  res.render("login", {
    title: "Login",
  });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
};
