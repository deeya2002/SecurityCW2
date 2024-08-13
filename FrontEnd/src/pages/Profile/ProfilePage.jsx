import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfileApi } from '../../apis/Api'; // Adjust the path as needed
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
          console.log(response.data)
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
    <div>
      <main>
        <section className="profile">
          <div className="info">
            <img
              src={user.userImageUrl || "/assets/images/noavatar.jpg"}
              alt="profile-pic"
              className="profile-pic"
            />
            <h3 style={{ textDecoration: 'underline' }}>My Profile</h3>
            <br></br>
            <h1>User Profile</h1>

            <div>
              {user ? (
                <div>
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                  <p><strong>User Name:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Location:</strong> {user.location}</p>
                  <p><strong>Bio:</strong> {user.bio}</p>
                </div>
              ) : (
                <p>User not found</p>
              )}
            </div>
          </div>
          <button type="submit" id="submit" onClick={handleClick}>
            Edit Profile
          </button>
        </section>
      </main>

    </div>
  );
};

export default UserProfile;
