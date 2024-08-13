const express = require("express");
const router = express.Router();
const foodController = require("../controllers/reviewControllers");
const { authGuard } = require("../middleware/authGuard");

// Route to add a review for a food
router.post("/addreview", foodController.addFoodReview);

// Route to update a review
router.put("/:id/reviews/:reviewID", foodController.updateFoodReview);

// Route to delete a review
router.delete("/:id/reviews/:reviewID", foodController.deleteFoodReview);

// Route to get all reviews for a food
router.get("/:id/reviews", foodController.getFoodReviews);

// Route to get review by id
router.get("/:id/reviews/:reviewID", foodController.getFoodReview);

// Route to like a review
router.post("/:id/reviews/:reviewID/like", foodController.likeFoodReview);

// Route to unlike a review
router.post("/:id/reviews/:reviewID/unlike", foodController.unlikeFoodReview);

//food id 
router.get('/food/:foodID', foodController.getAllFoodReviews);

module.exports = router;