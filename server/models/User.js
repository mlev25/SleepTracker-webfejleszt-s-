const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kérjük, adja meg a nevét'],
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Kérjük, adja meg az e-mail címét'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Kérjük, adjon meg érvényes e-mail címet'
        ]
    },
    password: {
        type: String,
        required: [true, 'Kérjük, adjon meg egy jelszót'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);