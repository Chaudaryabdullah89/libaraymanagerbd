const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const User = require('../Models/User');

const router = express.Router();



router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    console.log('Register attempt:', { email, username });

    try {
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            console.log(`User already exists: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedpass = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            password: hashedpass
        });

        await newUser.save();
        console.log('User registered:', newUser._id);

        const token = jwt.sign(
            { userId: newUser._id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'None', // for cross-site
            secure: true,     // for HTTPS
            // domain: '.yourdomain.com', // if needed
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(400).json({ message: 'User not found' });
        } else {
            console.log(`User found: ${user.username} (ID: ${user._id})`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Invalid password attempt for user: ${user.username} (ID: ${user._id})`);
            return res.status(400).json({ message: 'Invalid credentials' });
        } else {
            console.log(`Password matched for user: ${user.username} (ID: ${user._id})`);
        }

        const token = jwt.sign(
            { userId: user._id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'None', // for cross-site
            secure: true,     // for HTTPS
            // domain: '.yourdomain.com', // if needed
        });
        console.log(`JWT token generated for user: ${user.username} (ID: ${user._id})`);
        res.status(201).json({ message: 'User logged in successfully', user: user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})
router.post('/logout',(req,res)=>{
    res.clearCookie('token');
    console.log('User logged out and token cleared');
    res.status(200).json({ message: 'Logged out successfully' });
})
router.get('/check-auth', async (req, res) => {
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        // Fetch the user from the database to send full user info
        const user = await User.findById(decoded.userId).select('-password'); // exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ 
            message: 'Authenticated', 
            userId: decoded.userId, 
            user: user // send the user object directly
        });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
});
module.exports = router;