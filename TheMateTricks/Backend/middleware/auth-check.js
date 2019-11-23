const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        // splits the auth header at the white space on only looks at the token
        const token = req.headers.authorization.split(" ")[1];
        "Bearer kytdhfmfksglefdfmaklejieejg;adgkheghkghkgn/leajg;kah"
        jwt.verify(token, "kytdhfmfksglefdfmaklejieejg;adgkheghkghkgn/leajg;kah");
        next();
    }
    catch (error) {
        res.status(401).json({message: "Auth failed"})
    }
    
};