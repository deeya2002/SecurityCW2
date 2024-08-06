const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true,
        trim: true,
    },
    menuDescription: {
        type: String,
        required: true,
        trim: true,
    },
    menuImageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Menus = mongoose.model('menus', menuSchema);
module.exports = Menus;