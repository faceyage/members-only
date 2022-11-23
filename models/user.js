const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership_status: { type: Boolean },
  admin_status: { type: Boolean },
  avatar: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
