const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        trim: true,
    },
    restaurantLocation: {
        type: String, // Change the type according to your requirements
        trim: true,
    },
    restaurantRating: {
        type: Number, // Assuming you store the average rating as a number
        default: 0,
    },
    restaurantReview: [{
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        // },
        // rating: {
        //     type: Number,
        // },
        // comment: {
        //     type: String,
        //     trim: true,
        // },
        // createdAt: {
        //     type: Date,
        //     default: Date.now(),
        // },
        type: String,
    }],
    restaurantImageUrl: {
        type: String,
    },
    restaurantContact: {
        type: Number,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Restaurants = mongoose.model('restaurants', restaurantSchema);
module.exports = Restaurants;

