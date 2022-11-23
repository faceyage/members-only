//models
const User = require("../models/user");
//3rd party packages
require("dotenv").config();
const { body, validationResult } = require("express-validator"); //to validate form inputs

//Member

exports.become_member_get = (req, res, next) => {
  res.render("become_member", {
    title: "Become Member",
  });
};

exports.become_member_post = [
  body("password", "Password must be specified.")
    .trim()
    .isLength({ min: 1 })
    .equals(process.env.MEMBER_PASSWORD)
    .withMessage("Password Incorrect")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("become_member", {
        title: "Become Member",
        errors: errors.array(),
      });

      return;
    }

    //check twice if user logged in
    if (req.user == null) {
      const err = new Error("Please login to become member");
      err.status = 404;
      return next(err);
    }

    //no error make user member
    User.findByIdAndUpdate(req.user._id, { membership_status: true }, {}, (err) => {
      if (err) return next(err);

      res.redirect("/");
    });
  },
];

//Admin

exports.become_admin_get = (req, res, next) => {
  res.render("become_admin", {
    title: "Become Admin",
  });
};

exports.become_admin_post = [
  body("password", "Password must be specified.")
    .trim()
    .isLength({ min: 1 })
    .equals(process.env.ADMIN_PASSWORD)
    .withMessage("Password Incorrect")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("become_admin", {
        title: "Become Admin",
        errors: errors.array(),
      });

      return;
    }

    //check twice if user logged in
    if (req.user == null) {
      const err = new Error("Please login to become admin");
      err.status = 404;
      return next(err);
    }

    //no error make user admin
    User.findByIdAndUpdate(req.user._id, { admin_status: true }, {}, (err) => {
      if (err) return next(err);

      res.redirect("/");
    });
  },
];
