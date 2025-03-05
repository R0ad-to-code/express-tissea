const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a stop name']
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Stop', stopSchema);
