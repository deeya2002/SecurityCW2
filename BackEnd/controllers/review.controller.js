const mongoose = require('mongoose');
const {createError} = require("../utils/createError.js");
const Users = require("../model/usermodel")
const Review = require("../model/review.model.js")

const createReview = async (req, res, next) => {
  const newReview = new Review({
    userId: req.user.id,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      userId: req.user.id,
    });

    if (review) {
      return next(
        createError(403, "You have already created a review!")
      );
    }

    // TODO: Check if the user purchased the gig.

    const savedReview = await newReview.save();

    await Users.findByIdAndUpdate(req.body.userId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    // Sending a success message along with the created review data
    res.status(201).json({
      message: "Review has been created successfully!",
      review: savedReview,
    });
  } catch (err) {
    next(err);
  }
};

const getReviews = async (req, res) => {
  try {
    const allreviews = await Review.find({ });
    res.json({
      success: true,
      message: "All reviews fetched successfully!",
      reviews: allreviews,
  });
  } catch (err) {
    console.log(error);
    res.send("Internal server error");
  }
};

const deleteReview = async (req, res) => {
  const  reviewId = req.params.id;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.json({
        success: true,
        message: "Review deleted successfully!"
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Server error!!",
  });
  }
};



module.exports = {
  createReview,
  getReviews,
  deleteReview
}