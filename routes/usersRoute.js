const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();

router.post('/login', async function (req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user)
            throw new Error('Account not found\nPlease check your Email ID');

        if (!bcrypt.compareSync(req.body.password, user.password))
            throw new Error('Incorrect Password\nCheck your password');

        res.send(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async function (req, res) {
    try {
        const user = new User(req.body);
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        await user.save();
        res.send('User Registered Successfully');
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
