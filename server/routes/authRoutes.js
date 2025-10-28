const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Importáljuk a felhasználó sémát
const generateToken = require('../utils/generateToken'); // Importáljuk a JWT generálót

// @route   POST /api/auth/register
// @desc    Új felhasználó regisztrálása
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role, preferredSleepTime } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'A felhasználó már létezik ezzel az e-mail címmel.' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'USER',
            preferredSleepTime: preferredSleepTime || '8'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferredSleepTime: user.preferredSleepTime,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Szerverhiba regisztráció során.' });
    }
});


// @route   POST /api/auth/login
// @desc    Felhasználó bejelentkezése
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredSleepTime: user.preferredSleepTime,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Érvénytelen e-mail cím vagy jelszó.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Szerverhiba bejelentkezés során.' });
    }
});

module.exports = router;