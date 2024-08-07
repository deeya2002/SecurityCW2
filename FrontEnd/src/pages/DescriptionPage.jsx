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
    toast.success("Can order from here")
  };
  
  return (
    <div className="flex-container">
      <div className="food-image">
        <img src={foodDetails.foodImageUrl} alt={foodDetails.foodName} className="img-thumbnail" />
      </div>
      <div className="food-details">
        <div className="pname">{foodDetails.foodName}</div>
        <div className="price">Price: {foodDetails.foodPrice}</div>
        <div className="cate">
          <p>Category: </p> <p>{foodDetails.foodCategory}</p>
        </div>
        <p className="desc">Description: {foodDetails.foodDescription}</p>
        <p className="desc">Location: {foodDetails.foodLocation}</p>
        <div className="btn-box">
          <button
            className="cart-btn"
            onClick={handleSubmit}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;
