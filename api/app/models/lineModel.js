const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a stop name']
    },
    creation: {
        type: Date,
        default: Date.now
    },
    debut_activite: {
        type: String, // Format "HH:mm"
        required: true
    },
    fin_activite: {
        type: String, // Format "HH:mm"
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stops: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
            order: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model('Line', lineSchema);
