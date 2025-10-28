const mongoose = require('mongoose');

const SleepEventSchema = new mongoose.Schema({
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
}, { _id: false }); // nem kell sajat id az esemenyekhez

// alvasnaplo fo sema
const SleepSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    totalSleepMinutes: {
        type: Number,
        required: false,
        default: 0
    },
    sleepEvents: [SleepEventSchema] //beagyazzuk az esemeny semat
}, { timestamps: true });

SleepSessionSchema.index({ user: 1, date: 1 }, { unique: true });
const SleepSession = mongoose.model('SleepSession', SleepSessionSchema);

module.exports = SleepSession;