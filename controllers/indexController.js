const Message = require("../models/message");

exports.index = (req, res, next) => {
  Message.find()
    .sort({ timestamp: -1 })
    .populate("user")
    .exec((err, messages) => {
      if (err) return next(err);

      res.render("index", { title: "Members Only", messages });
    });
};
