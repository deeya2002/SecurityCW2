const request = require('supertest');
const app = require('../index');

//make collection of test cases
describe('API Testing', () => {
    //testing test route '/test'
    it('GET/test | Response should be text', async () => {
        const response = await request(app).get('/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Hello from server")
    })

    // Creating a user 
    it('POST/api/user/create | Response with success message', async () => {
        const response = await request(app).post('/api/user/create').send({
            'firstName': 'Ram',
            'lastName': 'Maharjan',
            'email': 'rammaharjan@gmail.com',
            'password': '123456'
        })
        if (response.body.success) {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("User created successfully.");
        } else {
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("User already exists.")
        }
    })

    //login
    it('Check user login', async () => {
        const response = await request(app).post('/api/user/login').send({
            email: 'rammaharjan@gmail.com',
            password: '123456'
        });
    // if user is not found 
        if (!response.body.success) {
            expect(response.body.message).toEqual('User does not exists.');
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('User Logged in Successfully.');
    })

    // create food
    it('POST/api/food/create_food | Response with success message', async () => {
        const response = await request(app).post('/api/food/create_food').send({
            foodName: 'pasta',
            foodPrice: '350',
            foodDescription: 'Italian food',
            foodCategory: 'Italian',
            foodImageUrl: 'https://th.bing.com/th/id/OIP.3qiOYdcpu2jl8G9ln1phLgHaE8?w=296&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            foodLocation: 'Thapathali'
        });
        if (!response.body.success) {
            expect(response.body.message).toEqual('Please fill all the fields');
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Food created successfully');
    })

    // fetching single food
    it('GET/api/food/get_food/:id | Response should be json', async () => {
        const response = await request(app)
            .get('/api/food/get_food/659410d1f22aeca653cc4ad1');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('food')
    })

    //test fetch all foods route 'api/food/get_foods'
    it('GET/api/food/get_foods | Response should be json', async () => {
        const response = await request(app).get('/api/food/get_foods');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("All foods fetched successfully.");
    })

    // test updating route api/food/update_food/:id
    it('PUT/api/food/update_food/:id | Response should be json', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWY0Y2FlNjAxZWQ5MDMyNmVmYjQ2NCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwOTI5MzI3MX0.-G2_7aYTYCk5WBMsPIjNgRKpw8JEFpemgfEBnq7uX3o'
        const response = await request(app)
            .put('/api/food/update_food/659410d1f22aeca653cc4ad1').set('Authorization', `Bearer ${token}`).send({
                foodName: 'pasta',
                foodPrice: '350',
                foodDescription: 'Italian food',
                foodCategory: 'Italian',
                foodLocation: 'Thapathali'
            });

        if (!response.body.success) {
            expect(response.body.message).toEqual('Food updated successfully with Image!');
        } else {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Food updated successfully without Image!')
        };
    })

    //test delete singlrroute 'api/food/delete_food/:id'
    it('DELETE/api/food/delete_food/:id | Response should be json', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWY0Y2FlNjAxZWQ5MDMyNmVmYjQ2NCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwOTI5MzI3MX0.-G2_7aYTYCk5WBMsPIjNgRKpw8JEFpemgfEBnq7uX3o'
        const response = await request(app).delete(`/api/food/delete_food/659410d1f22aeca653cc4ad1`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("Food deleted successfully!");
    })

    // create review
    it('POST/api/reviews/create_review | Response with success message', async () => {
            const response = await request(app).post('/api/reviews/create_review').send({
                desc: 'good',
                star: '3',
            });
            if (!response.body.success) {
                expect(response.body.message).toEqual("You have already created a review!");
            }
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("Review has been created successfully!");
        
        })
    //test fetch all reviews route 'api/food/get_reviews'
    it('GET/api/reviews/get_reviews | Response should be json', async () => {
        const response = await request(app).get('/api/reviews/get_reviews');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("All reviews fetched successfully!");
    })

    //test delete singlrroute 'api/food/delete_review/:id'
    it('DELETE/api/reviews/delete_review/:id | Response should be json', async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWY0Y2FlNjAxZWQ5MDMyNmVmYjQ2NCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwOTI5MzI3MX0.-G2_7aYTYCk5WBMsPIjNgRKpw8JEFpemgfEBnq7uX3o'
        const response = await request(app).delete(`/api/reviews/delete_review/659410d1f22aeca653cc4ad1`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("Review deleted successfully!");
    })
})