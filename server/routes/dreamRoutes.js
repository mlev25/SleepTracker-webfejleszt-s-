const express = require('express');
const router = express.Router();
const DreamLog = require('../models/DreamLog');
const { protect } = require('../middleware/authMiddleware');

// 1. POST /api/dreamlogs uj alomrekord 
router.post('/', protect, async (req, res) => {
    try {
        const { sleepSessionId, date, title, description, tags, isLucid } = req.body;
        
        const newDream = new DreamLog({
            user: req.user._id,
            sleepSessionId,
            date: date,
            title,
            description,
            tags,
            isLucid
        });

        const savedDream = await newDream.save();
        res.status(201).json(savedDream);
    } catch (error) {
        res.status(400).json({ message: 'Hiba történt az álom rögzítésekor.', error: error.message });
    }
});

// 2. GET /api/dreamlogs alomrekordok lekerdezese
router.get('/', protect, async (req, res) => {
    try {
        const dreams = await DreamLog.find({ user: req.user._id })
                                     .populate('sleepSessionId', 'date bedtime wakeupTime totalSleepMinutes')
                                     .sort({ date: -1 });
        res.json({ data: dreams, count: dreams.length });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt az álomnapló lekérésekor.' });
    }
});

// 3. PUT /api/dreamlogs/:id alomrekord frissitese
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedDream = await DreamLog.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDream) {
            return res.status(404).json({ message: 'Az álombejegyzés nem található.' });
        }

        res.json(updatedDream);
    } catch (error) {
        res.status(400).json({ message: 'Hiba történt az álom frissítésekor.', error: error.message });
    }
});

// 4. DELETE /api/dreamlogs/:id alomrekord torlese
router.delete('/:id', protect, async (req, res) => {
    try {
        const result = await DreamLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!result) {
            return res.status(404).json({ message: 'Az álombejegyzés nem található.' });
        }

        res.json({ message: 'Az álombejegyzés sikeresen törölve.' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt az álom törlésekor.' });
    }
});

module.exports = router;