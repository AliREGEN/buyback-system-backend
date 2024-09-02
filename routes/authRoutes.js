const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password
        });

        await user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'yourSecretKey',
            { expiresIn: '1h'},
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'yourSecretKey',
            { expiresIn: 5 * 60 * 60 },
            (err, token) => {
                if (err) throw err;

                // Include the user object in the response
                res.status(200).json({
                    token,
                    user: {
                        username: user.username,
                        email: user.email
                    }
                });
            }   
        );
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// Protected Route Example (Optional)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

function verifyToken(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = router;
