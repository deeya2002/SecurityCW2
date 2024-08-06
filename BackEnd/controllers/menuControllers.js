const cloudinary = require("cloudinary");
const Menus = require("../model/menuModel")

const createMenu = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        menuName,
        menuDescription,
    } = req.body;
    const { menuImage } = req.files;

    // step 3 : Validate data
    if (!menuName || !menuDescription || !menuImage ) {
        console.log(menuImage,menuDescription,menuName)
        return res.json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            menuImage.path,
            {
                folder: "menus",
                crop: "scale"
            }
        )
        // Save to database
        const newMenu = new Menus({
            menuName: menuName,
            menuDescription: menuDescription,
            menuImageUrl: uploadedImage.secure_url,
        })
        await newMenu.save();
        res.json({
            success: true,
            message: "Menu created successfully",
            menu: newMenu
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}
/// get all menus with pagination
const getAllMenus = async (req, res) => {
    try {
      // Extract page and limit from query parameters, default to page 1 and limit 10
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query._limit) || 10;
  
      // Calculate skip value based on the page and limit
      const skip = (page - 1) * limit;
  
      // Fetch menus with pagination
      const menus = await Menus.find({}).skip(skip).limit(limit);
  
      res.status(200).json({
        success: true,
        message: "All menus fetched successfully.",
        count: menus.length,
        page: page,
        limit: limit,
        menus: menus,
      });
    } catch (error) {
      res.json({
        success: false,
        message: "Server Error",
        error: error,
      });
    }
  };

// fetch single menu
const getSingleMenu = async (req, res) => {
    const menuId = req.params.id;
    try {
        const singleMenu = await Menus.findById(menuId);
        res.json({
            success: true,
            message: "Single menu fetched successfully!",
            menu: singleMenu
        })

    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }
}

// update menu
const updateMenu = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const {
        menuName,
        menuDescription,
    } = req.body;
    const { menuImage } = req.files;

    // validate data
    if (!menuName
        || !menuDescription) {
        return res.json({
            success: false,
            message: "Required fields are missing!"
        })
    }

    try {
        // case 1 : if there is image
        if (menuImage) {
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                menuImage.path,
                {
                    folder: "menus",
                    crop: "scale"
                }
            )

            // make updated json data
            const updatedData = {
                menuName: menuName,
                menuDescription: menuDescription,
                menuImageUrl: uploadedImage.secure_url,
            }

            // find menu and update
            const menuId = req.params.id;
            await Menus.findByIdAndUpdate(menuId, updatedData)
            res.json({
                success: true,
                message: "Menu updated successfully with Image!",
                updatedMenu: updatedData
            })

        } else {
            // update without image
            const updatedData = {
                menuName: menuName,
                menuDescription: menuDescription,
            }

            // find menu and update
            const menuId = req.params.id;
            await Menus.findByIdAndUpdate(menuId, updatedData)
            res.json({
                success: true,
                message: "Menu updated successfully without Image!",
                updatedMenu: updatedData
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// delete menu
const deleteMenu = async (req, res) => {
    const menuId = req.params.id;

    try {
        await Menus.findByIdAndDelete(menuId);
        res.json({
            success: true,
            message: "Menu deleted successfully!"
        })

    } catch (error) {
        res.json({
            success: false,
            message: "Server error!!"
        })
    }
}

module.exports = {
    createMenu,
    getAllMenus,
    getSingleMenu,
    updateMenu,
    deleteMenu,
}