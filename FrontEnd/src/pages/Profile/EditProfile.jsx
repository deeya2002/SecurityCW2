import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserProfileApi, updateUserProfileApi } from '../../apis/Api';

const EditProfile = () => {
    const user = JSON.parse(localStorage.getItem("user")) || null;

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); // Added lastName state
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [userImage, setUserImage] = useState('');
    const [userImageFile, setUserImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfileApi();
                if (response.data.success) {
                    const userData = response.data.userProfile;
                    setFirstName(userData.firstName || '');
                    setLastName(userData.lastName || ''); // Set lastName from userProfile
                    setUserName(userData.username || '');
                    setEmail(userData.email || '');
                    setNumber(userData.number || '');
                    setLocation(userData.location || '');
                    setBio(userData.bio || '');
                    setUserImage(userData.userImage || '');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName); // Append lastName to formData
        formData.append('username', username);
        formData.append('email', email);
        formData.append('number', number);
        formData.append('location', location);
        formData.append('bio', bio);
        if (userImageFile) {
            formData.append('userImage', userImageFile);
        }

        try {
            const response = await updateUserProfileApi(user?._id, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/profile');
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error('Internal Server Error!');
        }
    };

    const handleImageClick = () => {
        document.getElementById('profilePicInput').click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Edit Profile</h2>
                <div style={styles.profileHeader}>
                    <div style={styles.profilePic} onClick={handleImageClick}>
                        {userImage ? (
                            <img src={userImage} alt="Profile Picture" style={styles.profileImg} />
                        ) : (
                            <div style={styles.noImageText}>No Image</div>
                        )}
                        <input type="file" id="profilePicInput" style={{ display: 'none' }} onChange={handleImageChange} />
                        <div style={styles.editIcon}>✏️</div>
                    </div>
                    <div style={styles.profileInfo}>
                        <h3>{firstName} {lastName}</h3>
                        <p>{email}</p>
                    </div>
                </div>
                <form className="row g-3" style={styles.formgroup} onSubmit={handleSubmit}>
                    <div style={styles.formgroup}>
                        <label htmlFor="fullname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div className="column g-3" style={styles.formgroup}>
                        <label htmlFor="fullname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={styles.input} // Same style for consistency
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="number">Phone Number</label>
                        <input
                            type="text"
                            id="number"
                            placeholder="+977"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            placeholder="Enter Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="bio">Bio</label>
                        <input
                            type="text"
                            id="bio"
                            placeholder="Enter Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.editButton}>Save Changes</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        maxWidth: '800px',
        width: '100%',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    profilePic: {
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'pointer',
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    profileImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    noImageText: {
        fontSize: '16px',
        color: '#888888',
        textAlign: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        padding: '5px',
    },
    profileInfo: {
        flexGrow: 1,
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
    },
    formGroup: {
        flex: '1 1 300px',
    },

    formgroup: {
        flex: '1 1 100px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#FF8C8C',
        color: '#ffffff',
        border: 'none',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default EditProfile;
