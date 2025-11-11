const express = require('express');
const router = express.Router();

const SleepSession = require('../models/SleepSession');
const {generateSleepEvents} = require('../services/SleepService');
const {protect} = require('../middleware/authMiddleware');


// @route   GET /api/sleepsessions
// @desc    Lekeri az osszes alvasadatot a bejelentkezett felhasznalonak
// @access  Private

router.get('/', protect, async (req, res) => {
      try{
            const sleeps = await SleepSession.find({user: req.user._id}).sort({date: -1});
            res.json(sleeps);
      }catch(error){
            //console.error(error);
            res.status(500).json({message: 'Szerver hiba'});
      }
});


// @route POST /api/sleepsessions
// @desc  Uj alvasadat felvetele
// @access Private
router.post('/', protect, async (req, res) => {
      const {date, bedtime, wakeupTime, sleepQuality, wasInterrupted} = req.body;

      const totalMinutes = Math.round((new Date(wakeupTime) - new Date(bedtime)) / (1000 * 60));

      let sleepEvents = [];

      if (totalMinutes > 0) {
            sleepEvents = generateSleepEvents(totalMinutes, sleepQuality, wasInterrupted);
      }

      try{
            const newSleepSession = new SleepSession({
                  ...req.body,
                  date: new Date(date),
                  totalSleepMinutes: totalMinutes,
                  user: req.user._id,
                  sleepEvents: sleepEvents
            });

            const savedSession = await newSleepSession.save();
            res.status(201).json(savedSession);
      }catch(error){
            res.status(500).json({message: 'Server side error ' + error.message});
      }
});

// @route DELETE /api/sleepsessions/:id
// @desc alvasadat torlese megadott id alapjan
// @access Private

router.delete('/:id', protect, async (req, res) => {
      try{
            const success = await SleepSession.findOneAndDelete({
                  _id: req.params.id,
                  user: req.user._id
            });

            if(!success){
                  return res.status(404).json({message: 'Sleep not found or not authorized'});
            }

            res.json({message: 'Sleep session deleted succesfully'});


      }catch(error){
            res.status(500).json({message: 'Server side error, could not delete the specified sleep session'});
      }
});

//@route PUT /api/sleepsessions/:id
//@desc alvasadat modositasa megadott id alapjan
//@access Private
router.put('/:id', protect, async (req, res) => {
    const { date, bedtime, wakeupTime, sleepQuality, wasInterrupted } = req.body;

    const newBedtime = bedtime ? new Date(bedtime) : null;
    const newWakeupTime = wakeupTime ? new Date(wakeupTime) : null;
    const newDate = date ? new Date(date) : null;
    
    let updatedFields = { 
        date: newDate,
        bedtime: newBedtime,
        wakeupTime: newWakeupTime,
        sleepQuality: sleepQuality,
        wasInterrupted: wasInterrupted || false,
    };
    
    try{
        const existingSleep = await SleepSession.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if(!existingSleep){
            return res.status(404).json({message: 'Sleep session not found or not authorized'});
        }
        const isRecalculationNeeded = 
             (newBedtime && newBedtime.getTime() !== existingSleep.bedtime.getTime()) || 
             (newWakeupTime && newWakeupTime.getTime() !== existingSleep.wakeupTime.getTime()) || 
             sleepQuality !== existingSleep.sleepQuality ||
             wasInterrupted !== existingSleep.wasInterrupted;

        if(isRecalculationNeeded){
            const totalMinutes = Math.round((newWakeupTime - newBedtime) / (1000 * 60));
            let sleepEvents = [];
            if (totalMinutes > 0) {
                sleepEvents = generateSleepEvents(totalMinutes, sleepQuality, updatedFields.wasInterrupted);
            }
            updatedFields.totalSleepMinutes = totalMinutes;
            updatedFields.sleepEvents = sleepEvents;
        }

        const updatedSession = await SleepSession.findOneAndUpdate(
            {_id: req.params.id, user: req.user._id},
            {$set: updatedFields},
            {new: true, runValidators: true}
        );
        res.json(updatedSession);
    }catch(error){
        res.status(400).json({message: 'Hibás kérés vagy validációs hiba a frissítés során.', error: error.message});
    }
});

module.exports = router;