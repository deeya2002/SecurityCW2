const router = require('express').Router();
const foodController = require("../controllers/foodControllers");
const { authGuardAdmin, authGuard } = require('../middleware/authGuard');

//create the food
router.post('/create_food', foodController.createFood)

// get all foods
router.get("/get_foods", foodController.getAllFoods)

// single food
router.get("/get_food/:id", foodController.getSingleFood)

// update food
router.put("/update_food/:id", authGuardAdmin, foodController.updateFood)

// delete food
router.delete("/delete_food/:id", authGuardAdmin, foodController.deleteFood)

// create order 
router.post("/create_order", authGuard, foodController.createOrder)

//check pending by admin
router.post("/check_pending_order", authGuardAdmin, foodController.checkpendingorder)

//check status by admin 
router.post("/change_status", authGuardAdmin, foodController.changestatuspendingorder)

// check pending by user
router.post("/check_pending_order_user", authGuard, foodController.checkpendingorderuser)

//search food
router.post('/search', foodController.searchByFoodName);

//payment route
router.post('/payment', authGuard, foodController.orderPayment);

module.exports = router;