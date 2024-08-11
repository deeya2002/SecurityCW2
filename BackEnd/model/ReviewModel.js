const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./usermodel");

const reviewSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.Mixed,
    ref: User,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: User,
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

