import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrderApi } from '../apis/Api';
import { toast } from 'react-toastify';
const Cart = () => {
  const [CartDat, setCartDat] = useState ([]);
  const navigate = useNavigate();
  useEffect (() => {
    const cartFromCookies = Cookies?.get ('cart') || [];
    const decodedCart = decodeURIComponent (cartFromCookies);
    decodedCart && setCartDat (decodedCart&&JSON.parse (decodedCart));
  }, []);

  // submit function
  const handleSubmit = async e => {
        e.preventDefault ();
    const req={'foodList': JSON.stringify (CartDat)}
    console.log(req);
    try {
      createOrderApi (req)
        .then (res => {
          if (res.data.success === false) {
            if (res.data.message === 'Invalid token!') {
              toast.success (res.data.message);
              console.log ('re login');
            }
            toast.error (res.data.message);
          } else {
            toast.success (res.data.message);
            Cookies.remove('cart');
          }
        })
        .catch (err => {
          console.log (err);
          toast.error ('Internal Server Error!' + err);
        });
     
    } catch (error) {
      console.log (error);
    }
    navigate('/userorderlist');
  };

  const cardShow = (item, index) => {
    return (
      <tr key={index}>
        <td>
          <img
            src={item.oderfoodImageUrl}
            alt={item.foodName}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />
        </td>
        <td>{item.foodName}</td>
        <td>{item.order}</td>
        <td>{item.orderPrice}</td>
        <td>{item.order * item.orderPrice}</td>
      </tr>
    );
  };

  return (
    <div className="container-max py-8 pb-16">
      <h1 className="text-2xl my-4 font-semibold">Cart</h1>

      {/* cart details */}
      <div className="min-h-[60vh] pb-8">
        <table className="table">
          <thead className="table-danger">
            <tr>
              <th>Image</th>
              <th>Food Name</th>
              <th>Order Quantity</th>
              <th>Price per Item</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>{CartDat.map ((item, index) => cardShow (item, index))}</tbody>
        </table>
        <button
          onClick={handleSubmit}
          type="button"
          className="btn btn-outline-success"
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
