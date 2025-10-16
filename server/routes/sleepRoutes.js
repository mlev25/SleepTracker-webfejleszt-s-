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
      const {bedtime, wakeupTime, sleepQuality, wasInterrupted} = req.body;

      const totalMinutes = Math.round((new Date(wakeupTime) - new Date(bedtime)) / (1000 * 60));

      let sleepEvents = [];

      if (totalMinutes > 0) {
            sleepEvents = generateSleepEvents(totalMinutes, sleepQuality, wasInterrupted);
      }

      try{
            const newSleepSession = new SleepSession({
                  ...req.body,
                  date: new Date(bedtime),
                  totalSleepMinutes: totalMinutes,
                  user: req.user._id,
                  sleepEvents: sleepEvents
            });

            const savedSession = await newSleepSession.save();
            res.status(201).json(savedSession);
      }catch(error){
            res.status(500).json({message: 'Server side error'});
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
      const {bedtime, wakeupTime, sleepQuality, wasInterrupted} = req.body;

      let updatedFields = req.body;

      try{
            const existingSleep = await SleepSession.findOne({
                  _id:req.params.id,
                  user: req.user._id
            });

            if(!existingSleep){
                  return res.status(404).json({message: 'Sleep session not found or not authorized'});
            }

            const isRecalculationNeeded = 
            bedtime !== existingSleep.bedtime.toISOString() || 
            wakeupTime !== existingSleep.wakeupTime.toISOString() || 
            sleepQuality !== existingSleep.sleepQuality ||
            wasInterrupted !== existingSleep.wasInterrupted;

            if(isRecalculationNeeded){
                  const totalMinutes = Math.round((new Date(wakeupTime) - new Date(bedtime)) / (1000 * 60));
                  let sleepEvents = [];
                  if (totalMinutes > 0) {
                  sleepEvents = generateSleepEvents(totalMinutes, sleepQuality, wasInterrupted);
                  }
                  
                  updatedFields.sleepEvents = sleepEvents;
            }

            const updatedSession = await SleepSession.findOneAndUpdate(
                  {_id: req.params.id, user: req.user._id},
                  {$set: updatedFields},
                  {new: true, runValidators: true}
            );
            res.json(updatedSession);
      }catch(error){
            res.status(400).json({message: 'Server side error, could not update the specified sleep session', error: error.message});   
      }
})

module.exports = router;