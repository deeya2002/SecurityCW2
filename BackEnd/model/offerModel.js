const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    foodtype : {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
