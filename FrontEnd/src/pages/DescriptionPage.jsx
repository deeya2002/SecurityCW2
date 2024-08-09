import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addFoodReviewApi, getSingleFoodApi } from '../apis/Api'; // Adjust the import path if needed
import '../css/description.css'; // Ensure this path is correct

const DescriptionPage = () => {
  const { _id } = useParams(); // Food ID
  const navigate = useNavigate();
  const [foodDetails, setFoodDetails] = useState({
    foodName: '',
    foodPrice: '',
    foodDescription: '',
    foodCategory: '',
    foodImageUrl: '',
    foodLocation: '',
  });

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSingleFoodApi(_id)
      .then((res) => {
        const foodData = res.data.food || {};
        setFoodDetails({
          foodName: foodData.foodName || '',
          foodPrice: foodData.foodPrice || '',
          foodDescription: foodData.foodDescription || '',
          foodCategory: foodData.foodCategory || '',
          foodImageUrl: foodData.foodImageUrl || '',
          foodLocation: foodData.foodLocation || '',
        });
      })
      .catch((error) => {
        console.error('Error fetching food details:', error);
        toast.error("Failed to load food details");
      });
  }, [_id]);

  const handleOrder = () => {
    navigate("/");
    toast.success("Can order from here");
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        rating: rating,
        review: reviewText,
      };

      // Log the review data to verify it is correctly formatted
      console.log('Submitting review data:', reviewData);

      // Call the API function to add the review
      const response = await addFoodReviewApi(_id, reviewData);

      // Log the API response for debugging
      console.log('API response:', response);

      // Reset the state after submitting the review
      setRating(0);
      setReviewText("");
      setSubmitted(true);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    }
  };



  return (
    <div className="description-page">
      <div className="food-container">
        <div className="food-image">
          <img src={foodDetails.foodImageUrl} alt={foodDetails.foodName} className="img-thumbnail" />
        </div>
        <div className="food-details">
          <h1 className="food-name">{foodDetails.foodName}</h1>
          <p className="food-price">Price: {foodDetails.foodPrice}</p>
          <p className="food-category">Category: {foodDetails.foodCategory}</p>
          <p className="food-description">Description: {foodDetails.foodDescription}</p>
          <p className="food-location">Location: {foodDetails.foodLocation}</p>

          {/* Review Section moved below the location */}
          <div className="review-section">
            <h2 className="review-title">Add Your Review</h2>
            <div className="rating">
              <span className="rating-label">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`star-icon ${star <= rating ? 'filled' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => handleRatingClick(star)}
                  style={{ width: '20px', height: '20px' }} // Make stars smaller
                  aria-label={`Rate ${star} stars`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l2.76 6.39L22 9.3l-5 4.1 1.9 5.74L12 17.25l-4.9 3.89 1.9-5.75-5-4.1 7.24-0.92L12 2z"
                  />
                </svg>
              ))}
            </div>

            <textarea
              className="review-text"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={handleReviewChange}
              aria-label="Write your review"
            ></textarea>

            <button className="submit-review-btn" onClick={handleSubmitReview}>
              Submit Review
            </button>

            {submitted && <p className="success-message">Review submitted successfully!</p>}
          </div>

          <button className="add-to-cart-btn" onClick={handleOrder}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;
