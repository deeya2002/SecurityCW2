import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfileApi } from '../../apis/Api';
import '../../css/ProfilePage.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileApi();
        if (response.data.success) {
          setUser(response.data.userProfile);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching the user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleClick = () => {
    navigate('/editprofile');
  };

  return (
    <div className="profile-container">
      <main className="profile-main">
        <section className="profile">
          <div className="profile-header">
            <h1>Profile</h1>
          </div>
          <div className="profile-content">
            <div className="profile-image-wrapper">
              <img
                src={user?.userImage || "/assets/images/noavatar.jpg"}
                alt="profile-pic"
                className="profile-pic"
              />
              <button className="profile-edit-btn">
                <img src="/assets/images/camera.png" alt="Edit" />
              </button>
            </div>
            <div className="profile-info">
              {user ? (
                <>
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                  <p><strong>User Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Location:</strong> {user.location}</p>
                  <p><strong>Bio:</strong> {user.bio}</p>
                </>
              ) : (
                <p>User not found</p>
              )}
            </div>
          </div>
          <div className="profile-save-button">
            <button type="submit" onClick={handleClick}>Edit Profile</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
