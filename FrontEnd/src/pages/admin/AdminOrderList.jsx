import React, { useEffect, useState } from 'react';
import { changestatusApi, checkingPendingApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const AdminOrderList = () => {
  // Load all products when page loads
  const [orders, setOrders] = useState ([]);
const [refresh, setrefresh] = useState(false)
  useEffect (() => {
    checkingPendingApi ().then (res => {
      setOrders (res.data?.pendingorder);
    });
  }, [refresh]);

  const handleSubmit =(item)=>{
    changestatusApi (item).then((res) => {
        if (res.data.success === false) {
            toast.error(res.data.message)
        } else {
            toast.success(res.data.message)
            setrefresh(!refresh)
        }
    }).catch((err) => {
        console.log(err)
        toast.error('Internal Server Error!')
    })
  }
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
                  <button onClick ={()=>handleSubmit (item)}  className="btn btn-outline-danger">
                    Delivery
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default AdminOrderList;
