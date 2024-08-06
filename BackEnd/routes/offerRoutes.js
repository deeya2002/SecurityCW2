const router = require('express').Router();
const offerController = require("../controllers/offerControllers");
const { authGuardAdmin } = require('../middleware/authGuard');

// create offer
router.post('/create_offer', offerController.createOffer);

// get all offers
router.get("/get_offers", offerController.getAllOffers);

// single offer
router.get("/get_offer/:id", offerController.getSingleOffer);

// update offer
router.put("/update_offer/:id", authGuardAdmin, offerController.updateOffer);

// delete offer
router.delete("/delete_offer/:id", authGuardAdmin, offerController.deleteOffer);

module.exports = router;
