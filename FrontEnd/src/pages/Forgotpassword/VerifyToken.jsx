import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyTokenApi } from '../../apis/Api';
import '../../css/codestyle.css';

const VerifyToken = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Get the user's email from the previous state
    const userEmail = location.state && location.state.User_email;

    // Handle input changes for the token
    const handleChangeToken = (e) => {
        setToken(e.target.value);
    };

    const handleVerifyToken = (e) => {
        e.preventDefault();

        const data = {
            token: token,
            email: userEmail,
        };

        verifyTokenApi(data)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    // Navigate to reset password page with the token and email
                    navigate(`/resetpassword`, { state: { userEmail: userEmail } });
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.error('Server Error:', err);
                toast.error('Server Error');
            });
    };

    return (
        <div className="verify-email-background">
            <div className="verify-screen">
                <h1>Check Your Email</h1>
                <p>
                    We have sent a reset link to your email. <br />
                    Please enter the token mentioned in the email.
                </p>
                <form onSubmit={handleVerifyToken} id="vgt">
                    <input
                        type="text"
                        id="token"
                        name="token"
                        placeholder="Enter Verification Token"
                        value={token}
                        onChange={handleChangeToken}
                        required
                    />
                    <br />
                    <button type="submit" id="verify">
                        Verify
                    </button>
                </form>
                <div className="resend_link">
                    Didn't get a token? <a href="/sendemail">Click to resend</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyToken;
