//import router from express
const router = require('express').Router();
const userController = require('../controllers/usercontrollers.js');
const passwordRecoveryController = require('../controllers/forgetpasswordControllers.js')
const { authGuard } = require('../middleware/authGuard.js');
const { upload } = require('../middleware/uploads.js');

//all the routes for the user
//register the user
router
.route('/create')
.post(userController.createUser)

.get((req,res,next)=>{
  res.status(405).json({error: "GET request is accepted!"});
})
.put((req,res,next)=>{
  res.status(405).json({error: "PUT request is accepted!"});
})
.delete((req,res,next)=>{
  res.status(405).json({error: "DELETE request is accepted!"});
});

//verify email
router
.route('/verify-email')
.post(userController.verifyEmail)

.get((req,res,next)=>{
  res.status(405).json({error: "GET request is accepted!"});
})
.put((req,res,next)=>{
  res.status(405).json({error: "PUT request is accepted!"});
})
.delete((req,res,next)=>{
  res.status(405).json({error: "DELETE request is accepted!"});
});

//login the user
router
.route('/login')
.post(userController.loginUser)

.get((req,res,next)=>{
  res.status(405).json({error: "GET request is accepted!"});
})
.put((req,res,next)=>{
  res.status(405).json({error: "PUT request is accepted!"});
})
.delete((req,res,next)=>{
  res.status(405).json({error: "DELETE request is accepted!"});
});

//logout the user
router
.route('/logout')
.post(userController.logoutUser)

.get((req,res,next)=>{
  res.status(405).json({error: "GET request is accepted!"});
})
.put((req,res,next)=>{
  res.status(405).json({error: "PUT request is accepted!"});
})
.delete((req,res,next)=>{
  res.status(405).json({error: "DELETE request is accepted!"});
});


router.put('/updateuser/:id', authGuard, userController.updateUser);

// Get single user profile
router.get('/profile', authGuard, userController.getSingleUser);

// Update password
router.put("/change-password", authGuard, userController.updatePassword);

router
.route('/uploadImage')
.post(upload,userController.uploadImage)

.get((req,res,next)=>{
  res.status(405).json({error: "GET request is accepted!"});
})
.put((req,res,next)=>{
  res.status(405).json({error: "PUT request is accepted!"});
})
.delete((req,res,next)=>{
  res.status(405).json({error: "DELETE request is accepted!"});
});


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