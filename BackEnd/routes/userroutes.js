//import router from express
const router = require('express').Router();
const userController = require('../controllers/usercontrollers.js');
const { authGuard } = require('../middleware/authGuard.js');
const { upload } = require('../middleware/uploads.js');
const passwordRecoveryController = require('../controllers/forgetpasswordControllers.js');
const User = require("../model/usermodel")


//all the routes for the user
//register the user
router.post('/create', userController.createUser);

//login the user
router.post('/login', userController.loginUser);

// Get user profile
router.get("/getuser", authGuard, userController.getSingleUser);

// Update password
router.put("/change-password", authGuard, userController.updatePassword);



router.post("/uploadImage", upload, userController.uploadImage);

// Password recovery routes
router.post(
  "/password-recovery/request-password-reset",
  passwordRecoveryController.requestPasswordReset
);
// Route to verify the reset token
router.post('/password-recovery/verify-reset-token', passwordRecoveryController.verifyResetToken);
router.post(
  "/password-recovery/reset-password",
  passwordRecoveryController.resetPassword
);

//export
module.exports = router;