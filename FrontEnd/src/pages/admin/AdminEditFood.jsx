import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getSingleFoodApi, updateFoodApi } from '../../apis/Api'

const AdminEditFood = () => {
    // receive food id from url
    const {id} = useParams()

    // load food data
    useEffect(() => {
        getSingleFoodApi(id).then((res) => {
            console.log(res.data)
            setFoodName(res.data.food.foodName)
            setFoodPrice(res.data.food.foodPrice)
            setFoodDescription(res.data.food.foodDescription)
            setFoodCategory(res.data.food.foodCategory)
            setOldImage(res.data.food.foodImageUrl)
            setFoodLocation(res.data.food.foodLocation)
        })
    },[id])


    // Make useState
    const [foodName, setFoodName] = useState('')
    const [foodPrice, setFoodPrice] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [foodCategory, setFoodCategory] = useState('')
    const [oldImage, setOldImage] = useState('')
    const [foodLocation, setFoodLocation] = useState('')

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

    // handle submit function
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('foodName', foodName)
        formData.append('foodPrice', foodPrice)
        formData.append('foodDescription', foodDescription)
        formData.append('foodCategory', foodCategory)
        formData.append('foodImage', foodImage)
        formData.append('foodLocation', foodLocation)

        // make a api call
        updateFoodApi(id, formData).then((res)=>{
            if(res.data.success === false){
                toast.error(res.data.message)
            } else{
                toast.success(res.data.message)
                navigate('/admin/dashboard')
            }
        }).catch((err) => {
            console.log(err)
            toast.error('Internal Server Error!')
        })



    }


    return (
  
           <div className='m-4'>
      <h3>Editing food - <span className='text-danger'>{foodName}</span></h3>

      <div className='d-flex gap-3'>
        <form>
          <div className='mb-2'>
            <label >Food Name</label>
            <input
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className='form-control'
              type="text"
              placeholder='Enter food name'
            />
          </div>

          <div className='mb-2'>
            <label>Food Description</label>
            <textarea
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              className='form-control'
              placeholder="Enter description"
              cols="4"
              rows="4"
            ></textarea>
          </div>

          <div className='mb-2'>
            <label>Price</label>
            <input
              value={foodPrice}
              onChange={(e) => setFoodPrice(e.target.value)}
              type="number"
              className='form-control'
              placeholder='Enter your price'
            />
          </div>

          <div className='mb-2'>
            <label>Select category</label>
            <select
              onChange={(e) => setFoodCategory(e.target.value)}
              className='form-control'
            >
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Tibetian">Tibetian</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          <div className='mb-2'>
            <label>Food Image</label>
            <input
              onChange={handleImageUpload}
              type="file"
              className='form-control'
            />
          </div>

          <div className='mb-2'>
            <label>Select Location</label>
            <select
              onChange={(e) => setFoodLocation(e.target.value)}
              className='form-control'
            >
              <option value="Select">Select Location</option>
                                        <option value="Dillibazar">Dillibazar</option>
                                        <option value="New Road">New Road</option>
                                        <option value="Thapathali">Thapathali</option>
                                        <option value="Patan">Patan</option>
                                        <option value="NewBaneshwor">New-Baneshwor</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className='btn btn-primary w-100 mt-2'
          >
            Update Food
          </button>
        </form>

        <div>
          <h6>Old Image Preview</h6>
          <img
            className='img-fluid rounded-4 object-fit-cover'
            width={300}
            height={300}
            src={oldImage}
            alt=""
          />

          <h6 className='mt-4'>New Image</h6>
          {previewImage ? (
            <img
              src={previewImage}
              alt="food Image"
              className='img-fluid rounded-4 object-fit-cover'
              width={300}
              height={300}
            />
          ) : (
            <p>No image selected!</p>
          )}
        </div>
      </div>
    </div>
    )
}

export default AdminEditFood
