import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createRestaurantApi, deleteRestaurantApi, getAllRestaurantsApi } from '../../apis/Api';

const AdminRestaurant = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantLocation, setRestaurantLocation] = useState('');
    const [restaurantRating, setRestaurantRating] = useState('');
    const [restaurantReview, setRestaurantReview] = useState('');
    const [restaurantContact, setRestaurantContact] = useState('');
    
    const [restaurantImage, setRestaurantImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        getAllRestaurantsApi().then((res) => {
            setRestaurants(res.data.restaurants);
        });
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setRestaurantImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!restaurantName || !restaurantLocation || !restaurantRating || !restaurantReview || !restaurantContact || !restaurantImage) {
            toast.error('All fields are required');
            return;
        }

        const formData = new FormData();
        formData.append('restaurantName', restaurantName);
        formData.append('restaurantLocation', restaurantLocation);
        formData.append('restaurantRating', restaurantRating);
        formData.append('restaurantReview', restaurantReview);
        formData.append('restaurantContact', restaurantContact);
        formData.append('restaurantImage', restaurantImage);

        createRestaurantApi(formData)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    window.location.reload();
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error('Internal Server Error!');
            });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this restaurant?');
        if (!confirmDelete) {
            return;
        } else {
            deleteRestaurantApi(id).then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    setRestaurants((prevRestaurants) => prevRestaurants.filter((restaurant) => restaurant._id !== id));
                }
            });
        }
    };

    return (
        <>
            <div className='m-4'>
                <div className='d-flex justify-content-between'>
                    <h1>Admin Dashboard</h1>
                    <button type='button' className='btn btn-danger' data-bs-toggle='modal' data-bs-target='#exampleModal'>
                        Add Restaurant
                    </button>

              
<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
    <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Create a new Restaurant!</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">

            <label>Restaurant Name</label>
            <input onChange={(e) => setRestaurantName(e.target.value)} className='form-control mb-2' type="text" name="" id="" placeholder='Enter product name' />

            <label htmlFor="">Restaurant Location </label>
            <textarea onChange={(e) => setRestaurantLocation(e.target.value)} className='form-control mb-2' placeholder={"Enter description"} cols="4" rows="4"></textarea>

            <label htmlFor="">Restaurant Rating</label>
            <input onChange={(e) => setRestaurantRating(e.target.value)} type="number" className='form-control mb-2' placeholder='Enter your price' />

            <label htmlFor="">Restaurant Review</label>
            <input onChange={(e) => setRestaurantReview(e.target.value)} type="text" className='form-control mb-2' placeholder='Enter your price' />

            <label htmlFor="">Contact</label>
            <input onChange={(e) => setRestaurantContact(e.target.value)} type="number" className='form-control mb-2' placeholder='Enter your price' />


            <label>Restaurant Image</label>
            <input onChange={handleImageUpload} type="file" className='form-control' />

            {/* Preview Image */}

            {
                previewImage && <img src={previewImage} className='img-fluid rounded object-cover mt-2' />
            }

        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button onClick={handleSubmit} type="button" className="btn btn-primary">Save changes</button>
        </div>
    </div>
</div>
</div>
</div>
                <table className='table mt-2'>
                    <thead className='table-danger'>
                        <tr>
                            <th>Restaurant Image</th>
                            <th>Restaurant Name</th>
                            <th>Restaurant Location</th>
                            <th>Restaurant Rating</th>
                            <th>Restaurant Review</th>
                            <th>Restaurant Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((item) => (
                            <tr>
                                <td>
                                    <img src={item.restaurantImageUrl} alt='Restaurant' height={40} width={40} />
                                </td>
                                <td>{item.restaurantName}</td>
                                <td>{item.restaurantLocation}</td>
                                <td>{item.restaurantRating}</td>
                                <td>{item.restaurantReview.slice(0, 10)}</td>
                                <td>{item.restaurantContact}</td>
                                <td>
                                    <div className='btn-group' role='group' aria-label='Basic outlined example'>
                                        {/* <Link to={`/admin/edit/${restaurant._id}`} type='button' className='btn btn-outline-success'>
                                            Edit
                                        </Link> */}
                                        <button onClick={() => handleDelete(item._id)} type='button' className='btn btn-outline-danger'>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminRestaurant;


