const mongoose = require('mongoose');

const SleepEventSchema = new new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['LIGHT', 'DEEP', 'REM', 'WAKE'],
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date
    }
}, { _id: false }); // Eseményeknek nem kell saját _id

// Alvás Munkamenet fő sémája (1 oldal)
const SleepSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Ez a kulcs a 4-es szintű jogosultsághoz!
    },
    date: {
        type: Date,
        required: true
    },
    bedtime: {
        type: Date,
        required: true
    },
    wakeupTime: {
        type: Date,
        required: true
    },
    sleepQuality: {
        type: Number,
        min: 1,
        max: 5
    },
    wasInterrupted: {
        type: Boolean,
        default: false
    },
    sleepEvents: [SleepEventSchema] // Beágyazás
}, { timestamps: true });

module.exports = mongoose.model('SleepSession', SleepSessionSchema);