const cloudinary = require("cloudinary");
const Restaurants = require("../model/restaurantModel");

const createRestaurant = async (req, res) => {
    // Step 1: Check incoming data
    console.log(req.body);
    console.log(req.files);

    // Step 2: Destructuring data
    const {
        restaurantName,
        restaurantLocation,
        restaurantRating,
        restaurantReview,
        restaurantContact,
    } = req.body;
    const { restaurantImage } = req.files;

    // Step 3: Validate data
    if (!restaurantName || !restaurantLocation || !restaurantContact || !restaurantImage) {
        return res.json({
            success: false,
            message: "Please fill all the required fields",
        });
    }

    try {
        // Upload image to cloudinary
        const uploadedRestaurant = await cloudinary.v2.uploader.upload(
            restaurantImage.path,
            {
                folder: "restaurants",
                crop: "scale",
            }
        );

        // Save to database
        const newRestaurant = new Restaurants({
            restaurantName,
            restaurantLocation,
            restaurantRating,
            restaurantReview,
            restaurantContact,
            restaurantImageUrl: uploadedRestaurant.secure_url,
        });

        await newRestaurant.save();
        res.json({
            success: true,
            message: "Restaurant created successfully",
            restaurant: newRestaurant,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getAllRestaurants = async (req, res) => {

    try {
        // Extract page and limit from query parameters, default to page 1 and limit 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query._limit) || 3;

        const skip = (page - 1) * limit;

        // Fetch foods with pagination
        const restaurants = await Restaurants.find({}).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            message: "All Restaurants fetched successfully.",
            count: restaurants.length,
            page: page,
            limit: limit,
            restaurants: restaurants,
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};

// Fetch single restaurant
const getSingleRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const singleRestaurant = await Restaurants.findById(restaurantId);
        res.json({
            success: true,
            message: "Single restaurant fetched successfully!",
            restaurant: singleRestaurant,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
    // Step 1: Check incoming data
    console.log(req.body);
    console.log(req.files);

    // Destructuring data
    const {
        restaurantName,
        restaurantLocation,
        restaurantRating,
        restaurantReview,
        restaurantContact,
    } = req.body;
    const { restaurantImage } = req.files;

    // Validate data
    if (!restaurantName || !restaurantLocation || !restaurantContact || !restaurantImage) {
        return res.json({
            success: false,
            message: "Required fields are missing!",
        });
    }

    try {
        // Case 1: If there is an image
        if (restaurantImage) {
            // Upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                restaurantImage.path,
                {
                    folder: "restaurants",
                    crop: "scale",
                }
            );

            // Make updated JSON data
            const updatedData = {
                restaurantName,
                restaurantLocation,
                restaurantRating,
                restaurantReview,
                restaurantContact,
                restaurantImageUrl: uploadedImage.secure_url,
            };

            // Find restaurant and update
            const restaurantId = req.params.id;
            await Restaurants.findByIdAndUpdate(restaurantId, updatedData);
            res.json({
                success: true,
                message: "Restaurant updated successfully with Image!",
                updatedRestaurant: updatedData,
            });
        } else {
            // Update without image
            const updatedData = {
                restaurantName,
                restaurantLocation,
                restaurantRating,
                restaurantReview,
                restaurantContact,
            };

            // Find restaurant and update
            const restaurantId = req.params.id;
            await Restaurants.findByIdAndUpdate(restaurantId, updatedData);
            res.json({
                success: true,
                message: "Restaurant updated successfully without Image!",
                updatedRestaurant: updatedData,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        await Restaurants.findByIdAndDelete(restaurantId);
        res.json({
            success: true,
            message: "Restaurant deleted successfully!",
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server error!!",
        });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getSingleRestaurant,
    updateRestaurant,
    deleteRestaurant,
};
