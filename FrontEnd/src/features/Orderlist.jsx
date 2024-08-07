import React, { useEffect, useState } from 'react';
import { checkpendingorderuser } from './../apis/Api';
import { Link } from 'react-router-dom';

const OrderList = () => {
  // Load all products when page loads
const [orders, setOrders] = useState ([]);
const [refresh] = useState(false);

useEffect(() => {
  checkpendingorderuser().then((res) => {
    console.log(res.data);
    setOrders(res.data?.pendingorder || []);
  }).catch((error) => {
    // Handle error, log or display a message
    console.error("Error fetching orders:", error);
  });
}, [refresh]);

  return (
    <div>
      <table className="table mt-2">
        <thead className="table-danger">
          <tr>
            {/* <th>Food Image</th> */}
            <th>Food Name</th>
            <th>Food Price</th>
            <th>Order</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map (item => (
            <tr key={item._id}>
              <td>{item.foodName}</td>
              <td>NPR.{item.foodPrice}</td>
              <td>{item.order}</td>
              <td>{item.totalPrice}</td>
              <td>{item.status}</td>

              <td>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                >
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={'/payment'} type="button" className="btn btn-outline-success">Check order</Link>
    </div>
  );
};

export default OrderList;
