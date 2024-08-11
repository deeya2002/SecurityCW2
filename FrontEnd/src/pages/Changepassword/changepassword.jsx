import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updatePasswordApi } from '../../apis/Api';
import '../../css/resetstyle.css';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        const data = {
            currentPassword,
            newPassword,
            confirmPassword
        };

        try {

            const response = await updatePasswordApi(data);

            if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // navigate('/');
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="main">
            <div className="resetpsw">
                <div className="left"></div>
                <div className="right">
                    <div className="rbox">
                        <h1>Change password</h1><br />
                        <form onSubmit={handlePasswordChange}>
                            <label htmlFor="currentPassword">Enter current password</label><br />
                            <input type="password" id="currentPassword" name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            /><br /><br />

                            <label htmlFor="newPassword">Enter new password</label><br />
                            <input type="password" id="newPassword" name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} /><br /><br />

                            <label htmlFor="confirmPassword">Confirm new password</label><br />
                            <input type="password" id="confirmPassword" name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} /><br /><br />

                            <button type="submit" id="submit">Submit</button>
                        </form>
                        {error && <p className="error">{error}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
