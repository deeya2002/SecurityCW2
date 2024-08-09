import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleFoodApi } from '../apis/Api';
import '../css/description.css';

const DescriptionPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [foodDetails, setFoodDetails] = useState({
    foodName: '',
    foodPrice: '',
    foodDescription: '',
    foodCategory: '',
    foodImageUrl: '',
    foodLocation: '',
  });

  useEffect(() => {
    getSingleFoodApi(_id)
      .then((res) => {
        console.log(res.data);
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
      });
  }, [_id]);

  const handleSubmit = () => {
    navigate("/");
    toast.success("Can order from here");
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
          <button className="add-to-cart-btn" onClick={handleSubmit}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;