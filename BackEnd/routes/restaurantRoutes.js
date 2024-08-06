const router = require('express').Router();
const restaurantController = require('../controllers/restaurantControllers');
const { authGuardAdmin } = require('../middleware/authGuard');

//create the restaurant
router.post('/create_restaurant', restaurantController.createRestaurant);

// Get all restaurants
router.get('/get_restaurants', restaurantController.getAllRestaurants);

// Single restaurant
router.get('/get_restaurant/:id', restaurantController.getSingleRestaurant);

// Update restaurant
router.put('/update_restaurant/:id', authGuardAdmin, restaurantController.updateRestaurant);

// Delete restaurant
router.delete('/delete_restaurant/:id', authGuardAdmin, restaurantController.deleteRestaurant);

module.exports = router;
