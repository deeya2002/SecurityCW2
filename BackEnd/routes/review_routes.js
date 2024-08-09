const express = require("express");
const router = express.Router();
const foodController = require("../controllers/reviewControllers");
const { authGuard } = require("../middleware/authGuard");

// Route to add a review for a food
router.post("/:id/add", authGuard, foodController.addFoodReview);

// Route to update a review
router.put("/:id/reviews/:reviewID" , authGuard, foodController.updateFoodReview);

// Route to delete a review
router.delete("/:id/reviews/:reviewID", authGuard, foodController.deleteFoodReview);

// Route to get all reviews for a food
router.get("/:id/reviews", authGuard, foodController.getFoodReviews);

// Route to get review by id
router.get("/:id/reviews/:reviewID", authGuard, foodController.getFoodReview);

// Route to like a review
router.post("/:id/reviews/:reviewID/like", authGuard, foodController.likeFoodReview);

// Route to unlike a review
router.post("/:id/reviews/:reviewID/unlike", authGuard, foodController.unlikeFoodReview);

module.exports = router;