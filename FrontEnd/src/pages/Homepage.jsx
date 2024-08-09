import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFoodsApi } from '../apis/Api';
import '../css/home.css';
import { addToCart } from '../features/cart/cartSlice';

Modal.setAppElement('#root'); 
const Homepage = () => {
  const [foods, setFoods] = useState([]);
  const [orderitem, setOrderitem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const cartFromCookies = Cookies.get('cart');

    if (cartFromCookies) {
      try {
        const decodedCart = decodeURIComponent(cartFromCookies);
        setOrderitem(JSON.parse(decodedCart));
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      setOrderitem([]);
    }
  }, []);

  useEffect(() => {
    getAllFoodsApi(currentPage).then(res => {
      setFoods(res.data.foods);
    });
  }, [currentPage]);

  const loadMoreData = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const userToken = Cookies.get('userToken');
    setIsAuthenticated(!!userToken);
  }, []);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      dispatch(addToCart(orderitem));
      toast.success('Added to cart!');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  const HandelCart = (item, index) => {
    return (
      <div key={index} className="item-card">
        <Link to={`/descriptionpage/${item._id}`}>
          <img
            src={item.foodImageUrl}
            alt={item.foodName}
            className="food-images"
          />
        </Link>

        <div className="item-details">
          <div className="quantity-controls">
            <button
              className="quantityButton"
              onClick={() => {
                setOrderitem((prevOrderItems) => {
                  const existingItemIndex = prevOrderItems.findIndex(
                    (orderItem) => orderItem.foodName === item?.foodName
                  );

                  if (existingItemIndex !== -1) {
                    return prevOrderItems.map((orderItem, index) =>
                      index === existingItemIndex
                        ? { ...orderItem, order: orderItem.order + 1 >= 5 ? 5 : orderItem.order + 1, orderPrice: item.foodPrice, oderfoodImageUrl: item.foodImageUrl }
                        : orderItem
                    );
                  } else {
                    return [...prevOrderItems, { foodName: item?.foodName, order: 1, orderPrice: item.foodPrice, oderfoodImageUrl: item.foodImageUrl }];
                  }
                });
              }}
            >
              +
            </button>
            <p>
              {orderitem && orderitem
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
                    return prevOrderItems.map((orderItem, index) =>
                      index === existingItemIndex
                        ? { ...orderItem, order: orderItem.order - 1 < 1 ? 1 : orderItem.order - 1 }
                        : orderItem
                    );
                  }
                });
              }}
            >
              -
            </button>
          </div>
          <h3 className="food-name">{item.foodName}</h3>
          <p className="food-price">NPR.{item.foodPrice}</p>
          <p className="food-location">From.{item.foodLocation}</p>
          <button
            className="cart-btn"
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
          {foods.map((item, index) =>
            HandelCart(item, index))}
        </div>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Login Required"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Login Required</h2>
        <p>You need to login first to add items to the cart.</p>
        <button className="loginbutton" onClick={redirectToLogin}>Login</button>
        <button className="closebutton" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Homepage;
