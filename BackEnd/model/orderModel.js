const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({


    userId: {
        type: String,
        ref: "users",
        required: true,
    },
    foodName: {
        type: String,
        ref: "foods",
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    orderPrice: {
        type: Number,
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod:
    {
        type: String
    },
    paymentStatus:
    {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "pending",
    }
});
const Orders = mongoose.model('orders', orderSchema);
module.exports = Orders;