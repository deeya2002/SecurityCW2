const cloudinary = require("cloudinary");
const Offers = require("../model/offerModel");

// create offer
const createOffer = async (req, res) => {
    // step 1: check incoming data
    console.log(req.body);
    console.log(req.files);

    // step 2: Destructuring data
    const {
        name,
        rate,
        rating,
        type,
        foodtype,
    } = req.body;
    const { image } = req.files;

    // step 3: Validate data
    if (!name || !rate || !rating || !type || !image || !foodtype

) {
        console.log(name , rate, rating , type, image ,foodtype

)
        return res.json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            image.path, {
            folder: "offers",
            crop: "scale",
        });

        // Save to database
        const newOffer = new Offers({
            name: name,
            rate: rate,
            rating: rating,
            type: type,
            foodtype: foodtype,
            imageUrl: uploadedImage.secure_url,
        });
        await newOffer.save();
        res.json({
            success: true,
            message: "Offer created successfully",
            offer: newOffer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error" + error,
        });
    }
};
/// get all users with pagination
const getAllOffers = async (req, res) => {
    try {
        //limiting query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query._limit) || 10;

        const skip = (page - 1) * limit;

        const offers = await Offers.find({}).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            message: "All offers fetched successfully.",
            count: users.length,
            page: page,
            limit: limit,
            users: users,
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};

// fetch single offer
const getSingleOffer = async (req, res) => {
    const offerId = req.params.id;
    try {
        const singleOffer = await Offers.findById(offerId);
        res.json({
            success: true,
            message: "Single offer fetched successfully!",
            offer: singleOffer,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};

// update offer
const updateOffer = async (req, res) => {
    // step 1: check incoming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const { name, rate, rating, type, foodtype

 } = req.body;
    const { image } = req.files;

    // validate data
    if (!name || !rate || !rating || !type || !foodtype

) {
        return res.json({
            success: false,
            message: "Required fields are missing!",
        });
    }

    try {
        // case 1: if there is an image
        if (image) {
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                image.path,
                {
                    folder: "offers",
                    crop: "scale",
                }
            );

            // make updated json data
            const updatedData = {
                name: name,
                rate: rate,
                rating: rating,
                type: type,
                foodtype

: foodtype

,
                imageUrl: uploadedImage.secure_url,
            };

            // find offer and update
            const offerId = req.params.id;
            await Offers.findByIdAndUpdate(offerId, updatedData);
            res.json({
                success: true,
                message: "Offer updated successfully with Image!",
                updatedOffer: updatedData,
            });
        } else {
            // update without image
            const updatedData = {
                name: name,
                rate: rate,
                rating: rating,
                type: type,
                foodtype

: foodtype

,
            };

            // find offer and update
            const offerId = req.params.id;
            await Offers.findByIdAndUpdate(offerId, updatedData);
            res.json({
                success: true,
                message: "Offer updated successfully without Image!",
                updatedOffer: updatedData,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// delete offer
const deleteOffer = async (req, res) => {
    const offerId = req.params.id;

    try {
        await Offers.findByIdAndDelete(offerId);
        res.json({
            success: true,
            message: "Offer deleted successfully!",
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server error!!",
        });
    }
};

module.exports = {
    createOffer,
    getAllOffers,
    getSingleOffer,
    updateOffer,
    deleteOffer,
};
