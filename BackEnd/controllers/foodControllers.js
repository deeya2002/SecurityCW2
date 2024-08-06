const cloudinary = require("cloudinary");
const Foods = require("../model/foodModel");
const Orders = require("../model/orderModel");


const createFood = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        foodName,
        foodPrice,
        foodDescription,
        foodCategory,
        foodLocation,
    } = req.body;
    const { foodImage } = req.files;

    // step 3 : Validate data
    if (!foodName || !foodPrice || !foodDescription || !foodCategory || !foodImage || !foodLocation) {
        return res.json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            foodImage.path,
            {
                folder: "foods",
                crop: "scale"
            }
        )

        // Save to database
        const newFood = new Foods({
            foodName: foodName,
            foodPrice: foodPrice,
            foodDescription: foodDescription,
            foodCategory: foodCategory,
            foodImageUrl: uploadedImage.secure_url,
            foodLocation: foodLocation
        })
        await newFood.save();
        res.json({
            success: true,
            message: "Food created successfully",
            food: newFood
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}


// get all foods
// const getFoods = async (req,res) => {
//     try {
//         const allFoods = await Foods.find({});
//         res.json({
//             success : true,
//             message : "All foods fetched successfully!",
//             foods : allFoods
//         })

//     } catch (error) {
//         console.log(error);
//         res.send("Internal server error")
//     }

// }

/// get all foods with pagination
const getAllFoods = async (req, res) => {

    try {
        // Extract page and limit from query parameters, default to page 1 and limit 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query._limit) || 3;

        const skip = (page - 1) * limit;



        // Calculate skip value based on the page and limit
        // const skip = (page - 1) * limit;

        // Fetch foods with pagination
        const foods = await Foods.find({}).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            message: "All foods fetched successfully.",
            count: foods.length,
            page: page,
            limit: limit,
            foods: foods,
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};

// fetch single food
const getSingleFood = async (req, res) => {
    const foodId = req.params.id;
    try {
        const singleFood = await Foods.findById(foodId);
        res.json({
            success: true,
            message: "Single food fetched successfully!",
            food: singleFood
        })

    } catch (error) {
        console.log(error);
        res.send("Internal server error")
    }
}

// update food
const updateFood = async (req, res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // destructuring data
    const {
        foodName,
        foodPrice,
        foodDescription,
        foodCategory,
        foodLocation
    } = req.body;
    const { foodImage } = req.files;

    // validate data
    if (!foodName
        || !foodPrice
        || !foodDescription
        || !foodCategory
        || !foodLocation) {
        return res.json({
            success: false,
            message: "Required fields are missing!"
        })
    }

    try {
        // case 1 : if there is image
        if (foodImage) {
            // upload image to cloudinary
            const uploadedImage = await cloudinary.v2.uploader.upload(
                foodImage.path,
                {
                    folder: "foods",
                    crop: "scale"
                }
            )

            // make updated json data
            const updatedData = {
                foodName: foodName,
                foodPrice: foodPrice,
                foodDescription: foodDescription,
                foodCategory: foodCategory,
                foodImageUrl: uploadedImage.secure_url,
                foodLocation: foodLocation
            }

            // find food and update
            const foodId = req.params.id;
            await Foods.findByIdAndUpdate(foodId, updatedData)
            res.json({
                success: true,
                message: "Food updated successfully with Image!",
                updatedFood: updatedData
            })

        } else {
            // update without image
            const updatedData = {
                foodName: foodName,
                foodPrice: foodPrice,
                foodDescription: foodDescription,
                foodCategory: foodCategory,
                foodLocation: foodLocation
            }

            // find food and update
            const foodId = req.params.id;
            await Foods.findByIdAndUpdate(foodId, updatedData)
            res.json({
                success: true,
                message: "Food updated successfully without Image!",
                updatedFood: updatedData
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// delete food
const deleteFood = async (req, res) => {
    const foodId = req.params.id;

    try {
        await Foods.findByIdAndDelete(foodId);
        res.json({
            success: true,
            message: "Food deleted successfully!"
        })

    } catch (error) {
        res.json({
            success: false,
            message: "Server error!!"
        })
    }
}

const createOrder = async (req, res) => {

    //token bata user id 
    const userId = req.user.id;
    // Extract necessary information from the request body
    const orderList = JSON.parse(req.body?.foodList);
    console.log(userId);
    console.log(orderList);
    // Validate data
    if (!orderList || !Array.isArray(orderList) || orderList.length === 0) {
        return res.json({
            success: false,
            message: "Please provide a valid orderList with at least one item."
        });
    }

    try {

        // Loop through each item in the orderList
        for (const item of orderList) {
            const newOrder = new Orders({
                userId: userId,
                foodName: item.foodName,
                order: item.order,
                orderPrice: item.orderPrice,
                totalPrice: item.order * item.orderPrice

            })
            await newOrder.save();

        }
        res.json({
            success: true,
            message: "Order created succesfully!",

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const checkpendingorder = async (req, res) => {
    try {
        const checkpending = await Orders.find({ status: "pending" })
        res.json({
            success: true,
            message: "pending found!",
            pendingorder: checkpending
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const checkpendingorderuser = async (req, res) => {
    const userId = req.user.id
    try {
        const checkpending = await Orders.find({ userId: userId, })
        console.log(checkpending)
        res.json({
            success: true,
            message: "order found!",
            pendingorder: checkpending
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
const changestatuspendingorder = async (req, res) => {
    const { _id, foodName } = req.body;
    console.log(_id);
    try {
        const changestatus = await Orders.findOneAndUpdate(
            { _id: _id, foodName: foodName },
            { $set: { status: "fulfilled" } },
            { new: true } // To return the updated document
        );

        if (!changestatus) {
            return res.json({
                success: false,
                message: "Order not found or already updated",
            });
        }

        res.json({
            success: true,
            message: "Status update",
            status: changestatus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

const searchByFoodName = async (req, res) => {

    try {
        const { foodName } = req.body;
        console.log(foodName)
        const items = await Foods.find({ foodName });
        res.status(200).json({ success: true, foodNames: items });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


}

const orderPayment = async (req, res) => {
    const { paymentType } = req.body; // Extract userId from the route parameters
    const userId = req.user.id;
    console.log(userId);
    console.log(paymentType);

    try {
        // Make sure to validate that userId and paymentMethod are present
        if (!userId || !paymentType) {
            return res.status(400).json({ success: false, message: 'UserId and paymentMethod are required for payment.' });
        }

        // // Update the order with payment details
        const order = await Orders.findOneAndUpdate(
            { userId, status: 'Pending' },
            { paymentMethod: paymentType, paymentStatus: 'Processing' });
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    createFood,
    getAllFoods,
    getSingleFood,
    updateFood,
    deleteFood,
    createOrder,
    checkpendingorder,
    checkpendingorderuser,
    changestatuspendingorder,
    searchByFoodName,
    orderPayment
}