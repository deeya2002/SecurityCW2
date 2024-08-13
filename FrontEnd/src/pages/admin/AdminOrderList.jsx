import React, { useEffect, useState } from 'react';
import { changestatusApi, checkingPendingApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    checkingPendingApi()
      .then(res => {
        // Ensure pendingorder is always an array
        setOrders(res.data?.pendingorder || []);
      })
      .catch(error => {
        console.error('Error fetching pending orders:', error);
        toast.error('Failed to fetch orders.');
        setOrders([]);  // Handle error by setting orders to an empty array
      });
  }, [refresh]);

  const handleSubmit = (item) => {
    changestatusApi(item)
      .then(res => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setRefresh(!refresh);
        }
      })
      .catch(err => {
        console.error('Error updating order status:', err);
        toast.error('Internal Server Error!');
      });
  };

  return (
    <div>
      <table className="table mt-2">
        <thead className="table-danger">
          <tr>
            <th>Food Name</th>
            <th>Food Price</th>
            <th>Order</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map(item => (
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
                    <button
                      onClick={() => handleSubmit(item)}
                      className="btn btn-outline-danger"
                    >
                      Delivery
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;
