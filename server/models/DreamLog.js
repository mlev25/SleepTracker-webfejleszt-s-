const mongoose = require('mongoose');

const DreamLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    sleepSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SleepSession', 
        required: [true, 'A kapcsolódó alvásrekord azonosítója kötelező.']
    },
    
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: [50, 'A cím nem lehet hosszabb 100 karakternél.']
    },
    description: {
        type: String,
        required: [true, 'Az álom leírása kötelező.'],
        trim: true
    },
    
    tags: {
        type: [String], 
        default: [],
        validate: {
            validator: function(v) { return v.length <= 10; },
            message: props => `Maximum 10 címkét adhat meg. Jelenleg ${props.value.length} van rögzítve.`
        }
    },
    isLucid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('DreamLog', DreamLogSchema);