const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//this is to hold the logic for api routes

//create user
exports.createUser = (req, res, next) => {
    //encrypt password in database so we or anybody else cant see passwords
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        //save to database
        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User was created!',
                    result: result
                });
            })
            //for error catching
            .catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    });
};

//login user
exports.userLogin =  (req, res, next) => {
    //validate credentials are correct
    User.findOne({ email: req.body.email })
        .then(user => {
            //check if user exists
            if (!user) {
                return res.status(401).json({
                    message: "Auth not successful!"
                });
            }
            //so user can be used anywhere
            fetchedUser = user;
            //now check password if user exists
                //compare input to encrypted value
            return bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    //check if result is true (password matches)
                    if (!result) {
                        return res.status(401).json({
                            message: "Incorrect Password."
                        });
                    }
                    //if password exists we make a JSON web token (using jsonwebtoken package)
                        //THE SECRET SHOULD BE LONGER!!!!!!
                    const token = jwt.sign( {email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, { expiresIn: '1h'});
                    res.status(200).json({
                        token: token,
                        //in seconds
                        expiresIn: 3600,
                        message: 'Authentication scuccessful!',
                        userId: fetchedUser._id
                    })
                })
                //catch for errors
                .catch(err => {
                    console.log(err);
                    return res.status(401).json({
                        message: "Invalid authentication credentials!"
                    });
                });
        });
};