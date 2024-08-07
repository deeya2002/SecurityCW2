
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