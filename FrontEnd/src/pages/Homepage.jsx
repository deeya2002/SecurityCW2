import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFoodsApi } from '../apis/Api';
import '../css/home.css';
import { addToCart } from '../features/cart/cartSlice';

const Homepage = () => {
  // Load all products when the page loads
  const [foods, setFoods] = useState ([]);
  const [orderitem, setOrderitem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const cartFromCookies = Cookies.get('cart');
    
    // Check if cartFromCookies is undefined or empty
    if (cartFromCookies) {
      try {
        const decodedCart = decodeURIComponent(cartFromCookies);
        // console.log(decodedCart)
        setOrderitem(JSON.parse(decodedCart));
      } catch (error) {
        console.error('Error parsing JSON:', error);

      }
    } else {
      setOrderitem([]);
    }
  }, []);
  
  const loadMoreData = () => {
    // Increment the currentPage
    setCurrentPage(prevPage => prevPage + 1);
  };


  useEffect (() => {
    getAllFoodsApi (currentPage).then (res => {
      setFoods (res.data.foods);
    });
  }, [currentPage]);
  
  console.log(orderitem);

  const dispatch = useDispatch ();

  const handleAddToCart = () => {
    dispatch (addToCart (orderitem));
   
    toast.success('Added to cart!');
    
  };
  // var orderList = [{pizza: 5}, {cake: 2}];

  const HandelCart = (item, index) => {
    console.log(item)
    return (
      <div key={index} className="item-card">
        <Link to={`/descriptionpage/${item._id}`}>
          <img
            src={item.foodImageUrl}
            alt={item.foodName}
            style={{
              width: '200px',
              height: '150px',
              objectFit: 'cover',
            }}
          />
        </Link>
        
        <div className="item-details">
          <h3>{item.foodName}</h3>
          <p>{item.foodDescription}</p>
          <p>NPR.{item.foodPrice}</p>
          <p>From.{item.foodLocation}</p>
          <div className="flex">
          <button
          className="quantityButton"
            onClick={() => {
              setOrderitem((prevOrderItems) => {
                const existingItemIndex = prevOrderItems.findIndex(
                  (orderItem) => orderItem.foodName === item?.foodName
                );
              
                if (existingItemIndex !== -1) {
                  // If the item already exists in the array, update its order
                  return prevOrderItems.map((orderItem, index) =>
                    index === existingItemIndex
                      ? { ...orderItem, order: orderItem.order + 1 >=5?5:orderItem.order + 1, orderPrice: item.foodPrice , oderfoodImageUrl: item.foodImageUrl }
                      : orderItem
                  );
                } else {
                  // If the item doesn't exist, add a new order item
                  return [...prevOrderItems, { foodName: item?.foodName, order: 1,orderPrice: item.foodPrice, oderfoodImageUrl: item.foodImageUrl }];
                }
              });
            }
            }
            
          >
            +
          </button>
          <p>
  {orderitem&&orderitem
    .filter((selected) => selected.foodName === item.foodName)
    .map((selected, index) => (
      <span key={index}>{selected.order}</span>
    ))}
</p>
          <button
          className="quantityButton"
            onClick={() => {
              setOrderitem((prevOrderItems) => {
                const existingItemIndex = prevOrderItems.findIndex(
                  (orderItem) => orderItem.foodName === item?.foodName
                );
              
                if (existingItemIndex !== -1) {
                  // If the item already exists in the array, update its order
                  return prevOrderItems.map((orderItem, index) =>
                    index === existingItemIndex
                      ? { ...orderItem, order: orderItem.order - 1 <1?1:orderItem.order - 1}
                      : orderItem
                  );
                } 
              });
            }}
          >
          -
          </button>
          </div>
          <button
            className= "cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header>
        <h1>Welcome to Food Rush</h1>
        <p>Discover the finest cuisines from around the world.</p>
      </header>

      <section className="featured-items">
        <h2>Featured Items</h2>
        <div className="item-list">
          {foods.map ((item, index) => 
          HandelCart (item, index))}
        </div>
        {/* Button to load more data */}
      <button onClick={loadMoreData}>Load More</button>
      </section>

      <section className="about-us">
        <h2>About Us</h2>
        <p>
          At Food Rush, we are passionate about bringing you the best culinary
          experiences. Our chefs craft each dish with love and care to
          tantalize your taste buds.
        </p>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? Reach out to us at{' '}
          <a href="mailto:foodrush@gmail.com">info@foodrush.com</a>
        </p>
      </section>

      {/* <footer>
        <p>&copy; 2024 Food Rush. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Homepage;
