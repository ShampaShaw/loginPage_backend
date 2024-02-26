const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();       // Create a new router


// Register a new user
router.post('/register', async(req,res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    try {
        // Check if the user already exists
        const emailExists = await User.findOne({
            email: req.body.email
        });
        if(emailExists) {
            return res.status(400).send('Email already exists');
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        // Save the user
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login a user

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {   // If the user is not found
            return res.status(400).send('Email is not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        console.log('validPassword:', validPassword);

        if (!validPassword) {   // If the password is invalid
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);   // Create a token
        res.cookie('token', token, { httpOnly: true });   // Set the token as an HTTP-only cookie
        res.status(400).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                user,
                token
            }
          });
          return;
        // const user = await User.findOne({ email: req.body.email });

        // if (!user) {
        //     return res.status(400).send('Email is not found');
        // }

        // // Check if the password is correct
        // const validPassword = await bcrypt.compare(req.body.password, user.password);

        // if (!validPassword) {
        //     return res.status(400).send('Invalid password');
        // }

        // // Create and assign a token
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // // Set the token as an HTTP-only cookie
        // res.cookie('token', token, { httpOnly: true });

        // res.status(200).send('User logged in successfully');

    } catch (error) {
        console.error('Login Error:', error);
        res.status(400).send(error.message);
    }
});


// Logout a user

router.get('/logout', async(req,res) => {
    try {
        res.cookie('token', '', {
            expires: new Date(Date.now()),
            httpOnly: true
        }).send('User logged out successfully');
    } catch (error) {
        res.status(400).send(error);
    }
})


module.exports = router;       // Export the router