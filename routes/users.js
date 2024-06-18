const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)
    
}); // to find the user by jwt token

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');


    user = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    user = await user.save();

    const token = user.generateAuthToken();
//     //you can also use 
res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); //return only name and email
}); 
// res.send({
//     name: user.name,
//     email: user.email
// })

module.exports = router;