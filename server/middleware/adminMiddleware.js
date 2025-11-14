const protectAdmin = (req, res, nesxt) => {
      if (req.user && req.user.role === 'admin') {
            nesxt();
      }else {
            res.status(403);
            throw new Error('Csak adminisztrátorok férhetnek hozzá ehhez a művelethez.');
      }
};

module.exports = { protectAdmin };