import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFoodApi, deleteFoodApi, getAllFoodsApi } from '../../apis/Api'

const AdminDashboard = () => {

    // Make useState
    const [foodName, setFoodName] = useState('')
    const [foodPrice, setFoodPrice] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [foodCategory, setFoodCategory] = useState('')
    const [foodLocation, setFoodLocation] = useState('')
    const [currentPage, setCurrentPage] = useState(1);

    // make useState for image
    const [foodImage, setFoodImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    // image upload function
    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        console.log(file)
        setFoodImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }

    // Load all products when page loads
    const [foods, setFoods] = useState([])
    useEffect(() => {
        getAllFoodsApi(currentPage).then((res) => {
            setFoods(res.data.foods)
        })
    }, [currentPage])

    // submit function
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('foodName', foodName)
        formData.append('foodPrice', foodPrice)
        formData.append('foodDescription', foodDescription)
        formData.append('foodCategory', foodCategory)
        formData.append('foodImage', foodImage)
        formData.append('foodLocation', foodLocation)

        // send request to backend API
        createFoodApi(formData).then((res) => {
            if (res.data.success === false) {
                toast.error(res.data.message)
            } else {
                toast.success(res.data.message)
            }
        }).catch((err) => {
            console.log(err)
            toast.error('Internal Server Error!')
        })

    }
    const loadMoreData = () => {
        // Increment the currentPage
        setCurrentPage(prevPage => prevPage + 1);
      };

    // delete food function
    const handleDelete = (id) => {

        // confirm dialog box
        const confirm = window.confirm("Are you sure you want to delete this food?")
        if(!confirm){
            return
        } else {
            deleteFoodApi(id).then((res) => {
                if(res.data.success === false){
                    toast.error(res.data.message)
                } else{
                    toast.success(res.data.message)
                    window.location.reload()
                }
            })

        }

    }

    return (
        <>
            <div className='m-4'>
                <div className='d-flex justify-content-between'>
                    <h1>Admin Dashboard</h1>

                    <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Food
                    </button>

                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Create a new food!</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">

                                    <label>Food Name</label>
                                    <input onChange={(e) => setFoodName(e.target.value)} className='form-control mb-2' type="text" name="" id="" placeholder='Enter product name' />

                                    <label htmlFor="">Food Description</label>
                                    <textarea onChange={(e) => setFoodDescription(e.target.value)} className='form-control mb-2' placeholder={"Enter description"} cols="4" rows="4"></textarea>

                                    <label htmlFor="">Price</label>
                                    <input onChange={(e) => setFoodPrice(e.target.value)} type="number" className='form-control mb-2' placeholder='Enter your price' />

                                    <label htmlFor="">Select category</label>
                                    <select onChange={(e) => setFoodCategory(e.target.value)} className='form-control mb-2'>
                                        <option value="Indian">Indian</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Korean">Tibetian</option>
                                        <option value="Italian">Italian</option>
                                    </select>

                                    <label>Food Image</label>
                                    <input onChange={handleImageUpload} type="file" className='form-control' />

                                    {/* Preview Image */}
                                    {
                                        previewImage && <img src={previewImage} className='img-fluid rounded object-cover mt-2' />
                                    }
                                    <label htmlFor="">Select Location</label>
                                    <select onChange={(e) => setFoodLocation(e.target.value)} className='form-control mb-2'>
                                        <option value="Select">Select Location</option>
                                        <option value="Dillibazar">Dillibazar</option>
                                        <option value="New Road">New Road</option>
                                        <option value="Thapathali">Thapathali</option>
                                        <option value="Patan">Patan</option>
                                        <option value="NewBaneshwor">New-Baneshwor</option>
                                    </select>

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
                            <th>Food Image</th>
                            <th>Food Name</th>
                            <th>Food Price</th>
                            <th>Food Category</th>
                            <th>Food Description</th>
                            <th>Food Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            foods.map((item) => (
                                <tr>
                                    <td>
                                        <img src={item.foodImageUrl} height={80} width={80} />
                                    </td>
                                    <td>{item.foodName}</td>
                                    <td>NPR.{item.foodPrice}</td>
                                    <td>{item.foodCategory}</td>
                                    <td>{item.foodDescription.slice(0,10)}</td>
                                    <td>{item.foodLocation}</td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                                            <Link to={`/admin/edit/${item._id}`} type="button" className="btn btn-outline-success">Edit</Link>
                                            <Link onClick={() => handleDelete(item._id)} type="button" className="btn btn-outline-danger">Delete</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                                {/* Button to load more data */}
      <button onClick={loadMoreData}>Load More</button>
                    </tbody>
                </table>

            </div>

        </>
    )
}

export default AdminDashboard
