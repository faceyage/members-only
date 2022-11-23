var express = require("express");
var router = express.Router();

const indexController = require("../controllers/indexController");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

//* Authentication

/* GET home page. */
router.get("/", indexController.index);

// GET sign-up page
router.get("/sign-up", authController.sign_up_get);

// POST sign-up page
router.post("/sign-up", authController.sign_up_post);

// GET login page
router.get("/log-in", authController.login_get);

// POST login page
router.post("/log-in", authController.login_post);

// GET logout page
router.get("/log-out", authController.logout);

//* Message

// GET create message page
router.get("/create-message", messageController.create_message_get);

// POST create message page
router.post("/create-message", messageController.create_message_post);

// POST delete message page
router.post("/delete-message", messageController.delete_message_post);

//* User

// GET become member page
router.get("/become-member", userController.become_member_get);

// POST become member page
router.post("/become-member", userController.become_member_post);

// GET become member page
router.get("/become-admin", userController.become_admin_get);

// POST become member page
router.post("/become-admin", userController.become_admin_post);

module.exports = router;
