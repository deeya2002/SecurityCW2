const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
        trim: true,
    },
    foodPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    foodDescription: {
        type: String,
        required: true,
        trim: true,
    },
    foodCategory: {
        type: String,
        required: true,
        trim: true,
    },
    foodImageUrl: {
        type: String,
        required: true,
    },
    foodLocation: {
        type: String, 
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Foods = mongoose.model('foods', foodSchema);
module.exports = Foods;