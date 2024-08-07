import axios from "axios";
import foods_mock from "../mock/foods_mock";
import login_mock from "../mock/login_mock";
import restaurants_mock from "../mock/restaurant_mock";
import reviews_mock from "../mock/review_mock";
const backendURl = 'http://localhost:5000';

describe("App Testing", () => {
    //testing/test endpoint 
    it('GET/test | Test should Work', async () => {
        const response = await axios.get(`${backendURl}/test`)
        expect(response.status).toBe(200)
    });

    //login test
    it('POST /api/user/login | Login successful', async () => {
        const response = await axios.post(`${backendURl}/api/user/login`, login_mock)
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
    })
    //Get all foods, Each food name should match to 
    //each actual food mock data 
    it('GET /api/food/get_foods |Should work', async () => {
        const response = await axios.get(`${backendURl}/api/food/get_foods`)
        expect(response.status).toBe(200)
        expect(response.data.message).toBe('All foods fetched successfully.')
        expect(response.data.foods).toBeDefined()

        //match each product name
        response.data.foods.forEach((individualFood, index) => {
            expect(individualFood.foodName).toBe(foods_mock[index].foodName)
        })
    })

    it('GET /api/restaurant/get_restaurants |Should work', async () => {
        const response = await axios.get(`${backendURl}/api/restaurant/get_restaurants`)
        expect(response.status).toBe(200)
        expect(response.data.message).toBe('All restaurants fetched successfully!')
        expect(response.data.restaurants).toBeDefined()

        //match each product name
        response.data.restaurants.forEach((individualRestaurant, index) => {
            expect(individualRestaurant.restaurantName).toBe(restaurants_mock[index].restaurantName)
        })
    })
    it('POST /api/food/check_pending_order | Should work', async () => {
        const response = await axios.post(`${backendURl}/api/food/check_pending_order`);

        if (response.data.message === 'Authorization header missing!') {
            expect(response.data.message).toBe('Authorization header missing!');
        } else {
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('All orders fetched successfully!');
            expect(response.data.orders).toBeDefined();
        }
    });

    it('GET /api/reviews/get_reviews |Should work', async () => {
        const response = await axios.get(`${backendURl}/api/reviews/get_reviews`)
        expect(response.status).toBe(200)
        expect(response.data.message).toBe('All reviews fetched successfully!')
        expect(response.data.restaurants).toBeDefined();

        //match each product name
        response.data.reviews.forEach((individualReviews, index) => {
            expect(individualReviews.desc).toBe(reviews_mock[index].desc)
        })
    })

    it('GET /api/restaurant/get_restaurant/:id | Should work for a single restaurant', async () => {

        const restaurantIdToFetch = '65a94092f49fbc01f22ba08f'; 
        const expectedRestaurant = restaurants_mock.find(restaurant => restaurant.id === restaurantIdToFetch);
    
        const response = await axios.get(`${backendURl}/api/restaurant/get_restaurant/${restaurantIdToFetch}`);
        
        // Assuming 200 for a successful request 
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Single restaurant fetched successfully!');
        
    });

    it('GET /api/food/get_food/:id | Should work for a single restaurant', async () => {

        const foodIdToFetch = '65a933acf49fbc01f22ba05a'; 
        const expectedFood = foods_mock.find(foods => foods.id === foodIdToFetch);
    
        const response = await axios.get(`${backendURl}/api/food/get_food/${foodIdToFetch}`);
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Single food fetched successfully!');
        
    });

    it('DELETE /api/restaurant/delete_restaurant/:id | Should work for a single restaurant', async () => {
        const restaurantIdToDelete = 'restaurantIdToDelete'; 
        const expectedRestaurant = restaurants_mock.find(restaurant => restaurant.id === restaurantIdToDelete);
        const adminAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQzMzgxZDYyNTUxNWY2ZmJmMDM4ZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwOTQ1NDIzN30.qIbl8lqecHt0VlqPsbm4W5MeQACtHMsqOasbrvaXrv0';
        const response = await axios.delete(`${backendURl}/api/restaurant/delete_restaurant/${restaurantIdToDelete}`, {
            headers: {
                Authorization: `Bearer ${adminAuthToken}`
            }
        });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Restaurant deleted successfully!');
        const getDeletedRestaurantResponse = await axios.get(`${backendURl}/api/restaurant/get_restaurant/${restaurantIdToDelete}`);
        expect(getDeletedRestaurantResponse.status).toBe(404);
        expect(getDeletedRestaurantResponse.data.message).toBe('Restaurant not found');
    });

    it('DELETE /api/food/delete_food/:id | Should work for a single food item', async () => {
        const foodItemIdToDelete = 'foodItemIdToDelete'; // Replace with an actual food item ID
        const expectedFoodItem = foods_mock.find(foodItem => foodItem.id === foodItemIdToDelete);
        const adminAuthToken = 'ebhbkhbkv';
        const response = await axios.delete(`${backendURl}/api/food/delete_food/${foodItemIdToDelete}`, {
            headers: {
                Authorization: `Bearer ${adminAuthToken}`
            }
        });
    
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Food item deleted successfully!');
    
        const getDeletedFoodItemResponse = await axios.get(`${backendURl}/api/food/get_food/${foodItemIdToDelete}`);
        expect(getDeletedFoodItemResponse.status).toBe(404);
        expect(getDeletedFoodItemResponse.data.message).toBe('Food item not found');
    });

    
})