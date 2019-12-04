const express = require("express");

const UserController = require("../controllers/authorization");

const router = express.Router();

// creating the signup route that submit the authorization model to the mongoDB
router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
