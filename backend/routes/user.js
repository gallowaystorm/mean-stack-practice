const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', (req, res, next) => {
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
                err: err
            });
        });
    });
});

module.exports = router;