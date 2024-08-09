import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRestaurantsApi } from '../apis/Api';
import '../css/restaurant.css';

const RestaurantList = () => {
  // Load all products when the page loads
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAllRestaurantsApi().then(res => {
      setRestaurants(res.data.restaurants);
    });
  }, []);
  return (
    <section className="featured-items">
      <h2>Restaurant Lists</h2>
      <div className="item-list">
        {restaurants.map(item => (
          <div key={item.id} className="item-card">
            <Link>
              <img
                src={item.restaurantImageUrl}
                alt={item.restaurantName}
                style={{ width: '250px', height: '250px', objectFit: 'cover' }}
              />
            </Link>
            <div className="item-details">
              <h3>Name:{item.restaurantName}</h3>
              <p>Contact No.:{item.restaurantContact}</p>
              <p>Rating:{item.restaurantRating}</p>
              <p>Review:{item.restaurantReview}</p>
              <p>From.{item.restaurantLocation}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
