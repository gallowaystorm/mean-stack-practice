const jwt = require('jsonwebtoken');

//export function
module.exports = (req, res, next) => {
    //try to catch error if possible (error happens if no token)
    try {
        //pull token from header
        const token = req.headers.authorization
        //assign value to header and split on white space and the token is the 1st index because 'bearer' will be the first part
        .split(' ')[1];
        //verify token with same secret used to make it (will throw error if token is not verified or not correct)
        jwt.verify(token, 'secret_this_should_be_longer');
    } catch (error) {
        res.status(401).json({
            message: "Auth failed!"
        });
    }
}