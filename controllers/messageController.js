//models
const Message = require("../models/message");
//required third-party modules
const { body, validationResult } = require("express-validator"); //to validate form inputs

exports.create_message_get = (req, res) => {
  res.render("create_message", {
    title: "Create Message",
  });
};

exports.create_message_post = [
  body("title", "title must be specified").trim().isLength({ min: 1 }).escape(),
  body("message", "message must be specified").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //re-render with errors
      res.render("create_message", {
        title: "Create Message",
        errors: errors.array(),
      });

      return;
    }

    //check twice if user logged in
    if (req.user == null) {
      const err = new Error("Please login to create message");
      err.status = 404;
      return next(err);
    }

    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user._id,
    });

    message.save((err) => {
      if (err) return next(err);

      //Success redirect to homepage
      res.redirect("/");
    });
  },
];

exports.delete_message_post = [
  body("messageId", "No message id").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(errors[0].message);
    }

    //user is not admin
    if (!req.user?.admin_status) {
      const error = new Error("Error: You don't have admin access.");
      error.status = 401;
      return next(err);
    }

    Message.findByIdAndRemove(req.body.messageId, (err) => {
      if (err) return next(err);

      //removed successfully redirect
      res.redirect("/");
    });
  },
];
