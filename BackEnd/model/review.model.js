const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  star: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5]
  },
  desc: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;

