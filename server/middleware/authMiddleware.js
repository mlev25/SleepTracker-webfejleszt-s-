const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Ellenőrizd, hogy a kérés tartalmaz-e "Bearer" tokent az Authorization headerben
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token kinyerése (pl. "Bearer xyz.abc.123" -> "xyz.abc.123")
            token = req.headers.authorization.split(' ')[1];

            // Token dekódolása
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Felhasználó lekérése az adatbázisból ID alapján (jelszó nélkül)
            req.user = await User.findById(decoded.id).select('-password');

            // Továbbhaladás a következő middleware-re/controller-re
            next(); 
        } catch (error) {
            console.error(error);
            // Ha a token érvénytelen, lejárt, vagy nem dekódolható
            return res.status(401).json({ message: 'Nincs jogosultság, érvénytelen token.' });
        }
    }

    if (!token) {
        // Ha hiányzik az Authorization header
        return res.status(401).json({ message: 'Nincs jogosultság, nincs token.' });
    }
};

// Később egy szerepkör ellenőrző függvény is jöhet ide!

module.exports = { protect };