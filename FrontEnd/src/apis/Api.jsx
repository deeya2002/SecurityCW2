import axios from 'axios';
const Api = axios.create ({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// configuration for axios
const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem ('token')}`,
  },
};

// Creating test api
export const testApi = () => Api.get ('/test');
// http://localhost:5000//test

//  Creating register api
export const registerApi = data => Api.post ('/api/user/create', data);

// Create login api
export const loginApi = data => Api.post ('/api/user/login', data);

//Api for foods
// create food API
export const createFoodApi = formData =>
  Api.post ('/api/food/create_food', formData);

// get foods API
export const getAllFoodsApi = page =>
  Api.get (`/api/food/get_foods?page=${page}`);

// get single food API
export const getSingleFoodApi = id => Api.get (`/api/food/get_food/${id}`);

// update food
export const updateFoodApi = (id, formData) =>
  Api.put (`/api/food/update_food/${id}`, formData, config);

// delete food
export const deleteFoodApi = id =>
  Api.delete (`/api/food/delete_food/${id}`, config);

//Api for restaurant
// create restaurant API
export const createRestaurantApi = formData =>
  Api.post ('/api/restaurant/create_restaurant', formData);

// get foods API
export const getAllRestaurantsApi = () =>
  Api.get ('/api/restaurant/get_restaurants');

// get single restaurant API
export const getSingleRestauranttApi = id =>
  Api.get (`/api/restaurant/get_restaurant/${id}`);

// update restaurant
export const updateRestaurantApi = (id, formData) =>
  Api.put (`/api/restaurant/update_restaurant/${id}`, formData, config);

// delete restaurant
export const deleteRestaurantApi = id =>
  Api.delete (`/api/restaurant/delete_restaurant/${id}`, config);


//Forget password Apis
export const sendEmailApi = data => Api.post ('/api/user/resetpassword', data);

export const verifyCodeApi = data =>
  Api.post ('/api/user/resetcode', data, config);

export const updatePasswordApi = data =>
  Api.post ('/api/user/updatepassword', data);

//Update User APi
export const getUserProfileApi = data =>
  Api.get (`/api/user/getuser`, data, config);

export const updateUserProfileApi = formData =>
  Api.put (`/api/user/updateuser`, formData, config);

//Orser APi  
// create order API
export const createOrderApi = formData =>
  Api.post ('/api/food/create_order', formData, config);

export const checkingPendingApi = formData =>
  Api.post ('/api/food/check_pending_order', formData, config);

export const changestatusApi = formData =>
  Api.post ('/api/food/change_status', formData, config);

export const checkpendingorderuser = formData =>
  Api.post ('/api/food/check_pending_order_user', formData, config);

  //Search APi
export const searchByFoodName = formData =>
  Api.post ('/api/food/search', formData);

  //Payment APi
export const orderPayment = (formData) =>{
console.log(formData);
return Api.post ('/api/food/payment', formData, config);
}


//Reviews Api
export const createReview = formData =>
  Api.post ('/api/reviews/create_review', formData, config);

// get reviews API
export const getReviews = () =>
  Api.get ('/api/reviews/get_reviews');

  export const deleteReview = id =>
  Api.delete (`/api/reviews/delete_review/${id}`, config);