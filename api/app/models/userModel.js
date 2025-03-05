const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    admin: {
        type: Boolean,
        required: [true, 'Précisez si admin ou non']
    },
    stops: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stop'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
