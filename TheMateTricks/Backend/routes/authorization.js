const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/login", (req, res, next) => {
    Auth.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "User authentication failed"
            });
        }
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: "User authentication failed"
            });
        } 
        // the jwt.sign() method is what initializes the json web token 
        // the second paramter is a 'secret' or unique password that is used to create the jwt, stored on the server (security)
        const jwtoken = jwt.sign({email: user.email, userId: user._id}, 'kytdhfmfksglefdfmaklejieejg;adgkheghkghkgn/leajg;kah' );
    })
    .catch(err => {
        return res.status(401).json({
            message: "User authentication failed"
        });
    });
});

module.exports = router;