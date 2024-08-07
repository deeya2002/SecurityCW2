import axios from 'axios';
const Api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// configuration for axios
const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

// Creating test api
export const testApi = () => Api.get('/test');
// http://localhost:5000//test

//  Creating register api
export const registerApi = data => Api.post('/api/user/create', data);

// Create login api
export const loginApi = data => Api.post('/api/user/login', data);

export const updatePasswordApi = data => Api.put('/api/user/change-password', data, config);


//Forget password Recovery Apis
export const requestPasswordResetApi = data =>
  Api.post('/api/user/password-recovery/request-password-reset', data);

export const resetPasswordApi = (token, data) =>
  Api.post(`api/user/password-recovery/reset-password/${token}`, data);

//Api for foods
// create food API
export const createFoodApi = formData =>
  Api.post('/api/food/create_food', formData);

// get foods API
export const getAllFoodsApi = page =>
  Api.get(`/api/food/get_foods?page=${page}`);

// get single food API
export const getSingleFoodApi = id => Api.get(`/api/food/get_food/${id}`);

// update food
export const updateFoodApi = (id, formData) =>
  Api.put(`/api/food/update_food/${id}`, formData, config);

// delete food
export const deleteFoodApi = id =>
  Api.delete(`/api/food/delete_food/${id}`, config);

//Api for restaurant
// create restaurant API
export const createRestaurantApi = formData =>
  Api.post('/api/restaurant/create_restaurant', formData);

// get foods API
export const getAllRestaurantsApi = () =>
  Api.get('/api/restaurant/get_restaurants');

// get single restaurant API
export const getSingleRestauranttApi = id =>
  Api.get(`/api/restaurant/get_restaurant/${id}`);

// update restaurant
export const updateRestaurantApi = (id, formData) =>
  Api.put(`/api/restaurant/update_restaurant/${id}`, formData, config);

// delete restaurant
export const deleteRestaurantApi = id =>
  Api.delete(`/api/restaurant/delete_restaurant/${id}`, config);




//Update User APi
export const getUserProfileApi = data =>
  Api.get(`/api/user/getuser`, data, config);

export const updateUserProfileApi = formData =>
  Api.put(`/api/user/updateuser`, formData, config);

//Orser APi  
// create order API
export const createOrderApi = formData =>
  Api.post('/api/food/create_order', formData, config);

export const checkingPendingApi = formData =>
  Api.post('/api/food/check_pending_order', formData, config);

export const changestatusApi = formData =>
  Api.post('/api/food/change_status', formData, config);

export const checkpendingorderuser = formData =>
  Api.post('/api/food/check_pending_order_user', formData, config);

//Search APi
export const searchByFoodName = formData =>
  Api.post('/api/food/search', formData);

//Payment APi
export const orderPayment = (formData) => {
  console.log(formData);
  return Api.post('/api/food/payment', formData, config);
}


//Reviews Api

// Function to add a review for a food
export const addFoodReviewApi = (id, formData) =>
  axios.post(`/api/reviews/${id}/addreview`, formData, config);

// Function to update a review
export const updateFoodReviewApi = (id, reviewID, reviewData) =>
  axios.put(`/api/reviews/${id}/reviews/${reviewID}`, reviewData, config);

// Function to delete a review
export const deleteFoodReviewApi = (id, reviewID) =>
  axios.delete(`/api/reviews/${id}/reviews/${reviewID}`, config);

// Function to get all reviews for a food
export const getFoodReviewsApi = (id) =>
  axios.get(`/api/reviews/${id}/reviews`, config);

// Function to get a review by id
export const getFoodReviewApi = (id, reviewID) =>
  axios.get(`/api/reviews/${id}/reviews/${reviewID}`, config);

// Function to like a review
export const likeFoodReviewApi = (id, reviewID) =>
  axios.post(`/api/reviews/${id}/reviews/${reviewID}/like`, {}, config);

// Function to unlike a review
export const unlikeFoodReviewApi = (id, reviewID) =>
  axios.post(`/api/reviews/${id}/reviews/${reviewID}/unlike`, {}, config)