const router = require('express').Router();
const menuController = require("../controllers/menuControllers");
const { authGuardAdmin } = require('../middleware/authGuard');


//create the menu
router.post('/create_menu', menuController.createMenu)

// get all menus
router.get("/get_menus", menuController.getAllMenus)

// single menu
router.get("/get_menu/:id", menuController.getSingleMenu)

// update menu
router.put("/update_menu/:id",authGuardAdmin, menuController.updateMenu)

// delete menu
router.delete("/delete_menu/:id",authGuardAdmin ,menuController.deleteMenu)


module.exports = router;