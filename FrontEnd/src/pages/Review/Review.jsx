import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createReview } from '../../apis/Api';
import "../../css/Review.css";

const Review = () => {
    const [desc, setdesc] = useState('');
    const [star, setstar] = useState(0);
    const navigate = useNavigate();
    const handleButtonClick = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('desc', desc);
        formData.append('star', star);

        // send request to backend API
        createReview(formData)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                }
                console.log(res)
            })
            .catch((err) => {
                console.log(err);
                toast.error('Review has already been created!');
            });
        navigate("/reviewlist");

    };

    return (
        <div className="app-container">
            <h1>Review and Rate Page</h1>
            <div className="star-container">
                <p>Select a star:</p>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={value <= star ? 'star-filled' : 'star'}
                            onClick={() => setstar(value)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
            <div className="review-container">
                <p>Write your review:</p>
                <textarea
                    rows="4"
                    cols="50"
                    value={desc}
                    onChange={(e) => setdesc(e.target.value)}
                    placeholder="Write your review here..."
                ></textarea>
            </div>
            <button onClick={handleButtonClick}>Submit</button>
        </div>
    );
};

export default Review;
