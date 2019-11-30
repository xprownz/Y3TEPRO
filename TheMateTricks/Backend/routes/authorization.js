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
    let foundUser;
    Auth.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: "User authentication failed"
            });
        }
        foundUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: "User authentication failed"
            });
        } 
        // the jwt.sign() method is what initializes the json web token 
        // the second argument is a 'secret' or unique password that is used to create the jwt, stored on the server (security)
        // the third argument is the configuration of the token
        const jwtoken = jwt.sign(
            {email: foundUser.email, userId: foundUser._id},
            'kytdhfmfksglefdfmaklejieejg;adgkheghkghkgn/leajg;kah',
            //defines the length of time it takes the token to expire on the server
            {expiresIn: "1h" }
        ); 
        // successful login returns the token 
        res.status(200).json({
            token: jwtoken,
            //duration in seconds until the token expires
            expiresIn: 3600,
            userId: foundUser._id
        })
    })
    .catch(err => {
        return res.status(401).json({
            message: "User authentication failed"
        });
    });
});

module.exports = router;