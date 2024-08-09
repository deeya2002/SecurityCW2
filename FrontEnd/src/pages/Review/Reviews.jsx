// // ReviewComponent.jsx

// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { deleteReview, getReviews } from '../../apis/Api';
// import '../../css/Reviews.css';

// const ReviewComponent = () => {
//   const [reviews, setReviews] = useState([]);
//   const Saveuser = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     getReviews()
//       .then((res) => {
//         setReviews(res.data.reviews || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching reviews:", error);
//       });

//   }, []);

//   const handleDeleteReview = (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this review?');
//     if (!confirmDelete) {
//       return;
//     } else {
//       deleteReview(id).then((res) => {
//         if (res.data.success === false) {
//           toast.error(res.data.message);
//         } else {
//           toast.success(res.data.message);
//           setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
//         }
//       });
//     }
//   };

//   return (
//     <div className="review-section">
//       <h2>User Reviews</h2>
//       {reviews && reviews.length > 0 ? (
//         reviews.map((item) => (
//           <div key={item.id} className="review-container">
//             <p>{item.desc}</p>
//             <div className="star-rating">
//               {Array.from({ length: item.star }, (_, index) => (
//                 <span key={index} className="star">&#9733;</span>
//               ))}
//             </div>
//             {Saveuser && Saveuser.isAdmin === true ? (
//               <button onClick={() => handleDeleteReview(item._id)} className="delete-button">
//                 Delete Review
//               </button>
//             ) : null}
//           </div>
//         ))
//       ) : (
//         <p>No reviews available</p>
//       )}
//     </div>
//   );
// };

// export default ReviewComponent;
