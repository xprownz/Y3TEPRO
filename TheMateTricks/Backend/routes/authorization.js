const express = require("express");
const Auth = require("../models/authorization");

const app = express.Router();

// creating the signup route that submit the authorization model to the mongoDB
router.post("/signup", (req, res, next)  => {
    const auth = new Auth({
        email: req.body.email,
        password: req.body.password
    });
});

module.exports = router;