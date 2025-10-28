const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token kinyerese (pl. "Bearer xyz.abc.123" -> "xyz.abc.123")
            token = req.headers.authorization.split(' ')[1];

            // Token dekodoljuk a JWT_SECRET alapjan
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // felhasznalot lekerjuk jelszo nelkul a '-' segitsegevel
            req.user = await User.findById(decoded.id).select('-password');

            // kovi middleware
            next();
        } catch (error) {
            console.error(error);
            //ervenytelen a token vagy mas baja van
            return res.status(401).json({ message: 'Nincs jogosultság, érvénytelen token.' });
        }
    }

    if (!token) {
        // ha nincs headerben authorization resz
        return res.status(401).json({ message: 'Nincs jogosultság, nincs token.' });
    }
};

module.exports = { protect };