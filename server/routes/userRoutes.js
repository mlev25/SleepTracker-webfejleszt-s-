const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {protectAdmin} = require('../middleware/adminMiddleware');
const User = require('../models/User');

// @route   GET /api/users
// @desc    Osszes felhasznalo lekerdezese
// @access  Private/Admin

router.get('/', protect, protectAdmin, async (req, res) => {
      const users = await User.find({}).select('-password');
      res.json(users);
});


// @route   DELETE /api/users/:id
// @desc    Felhasznalo torlese id alapjan
// @access  Private/Admin
router.delete('/:id', protect, protectAdmin, async (req, res) => {
      const user = await User.findOneAndDelete({_id: req.params.id});
      if (user) {
            res.json({message: 'Felhasználó sikeresen torolve.'});
      } else {
            res.status(404).json({message: 'Felhasználó nem található.'});
      }
});

module.exports = router;