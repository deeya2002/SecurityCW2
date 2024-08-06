const router = require('express').Router();
const reviewController = require("../controllers/review.controller");
const { authGuard, authGuardAdmin } = require('../middleware/authGuard');

// create review
router.post('/create_review',authGuard, reviewController.createReview);

// get all review
router.get("/get_reviews",reviewController.getReviews);

// delete offer by id 
router.delete("/delete_review/:id", authGuardAdmin, reviewController.deleteReview);

module.exports = router;