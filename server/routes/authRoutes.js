const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Importáljuk a felhasználó sémát
const generateToken = require('../utils/generateToken'); // Importáljuk a JWT generálót

// @route   POST /api/auth/register
// @desc    Új felhasználó regisztrálása
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Ellenőrzés: Létezik-e már felhasználó ezzel az e-mail címmel?
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'A felhasználó már létezik ezzel az e-mail címmel.' });
        }

        // 2. Felhasználó példányosítása
        user = new User({
            name,
            email,
            password, // Ezt a jelszót hasheljük a 3. lépésben
            role: role || 'USER'
        });

        // 3. Jelszó hashelése (Bcrypt)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // 4. Mentés az adatbázisba
        await user.save();

        // 5. JWT generálása és visszaküldése
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        // Hibakezelés a validáció vagy adatbázis hiba esetén
        res.status(500).json({ message: error.message || 'Szerverhiba regisztráció során.' });
    }
});


// @route   POST /api/auth/login
// @desc    Felhasználó bejelentkezése
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Felhasználó keresése (Fontos: lekérjük a jelszót is a select: false ellenére)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            // 2. Sikeres összehasonlítás, JWT generálása
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // 3. Sikertelen hitelesítés
            res.status(401).json({ message: 'Érvénytelen e-mail cím vagy jelszó.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Szerverhiba bejelentkezés során.' });
    }
});

module.exports = router;