const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        // splits the auth header at the white space on only looks at the token
        const token = req.headers.authorization.split(' ')[1];
        const decryptedToken = jwt.verify(token, 'kytdhfmfksglefdfmaklejieejg;adgkheghkghkgn/leajg;kah');
        //express allows the addition of a new field including the decrypted user email and id
        req.userData = {email: decryptedToken.email, userId: decryptedToken.userId };
        next();
    }
    catch (error) {
        res.status(401).json({message: "User authentication failed"})
    }

};
