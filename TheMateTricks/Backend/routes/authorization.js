const express = require("express");
const bcrypt = require("bcrypt");

const Auth = require("../models/authorization");

const router = express.Router();

// creating the signup route that submit the authorization model to the mongoDB
router.post("/signup", (req, res, next)  => {
    // using bcrypt node package to encrypt the user password and send the hash back as a response
    bcrypt.hash(req.body.password, 15)
    .then(hash => {
        const auth = new Auth({
            email: req.body.email,   
            password: hash
        });
        // save the user to the database with the encyption for security
        auth.save()
        .then(result => {
            res.status(201).json({
                message: "User has been created",
                result: result
            });
        })
        // catch is used for error handling for failed authentication
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
});

module.exports = router;