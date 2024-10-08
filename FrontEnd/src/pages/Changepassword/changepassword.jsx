import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { updatePasswordApi } from '../../apis/Api';
import '../../css/resetstyle.css';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });

    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setErrors({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });

        const data = {
            currentPassword,
            newPassword,
            confirmPassword
        };

        try {
            const response = await updatePasswordApi(data);

            if (response.data.success === false) {
                setErrors(prevErrors => ({ ...prevErrors, general: response.data.message }));
                toast.error(response.data.message);
            } else {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrors(prevErrors => ({ ...prevErrors, general: error.response.data.error }));
                toast.error(error.response.data.error);
            } else {
                setErrors(prevErrors => ({ ...prevErrors, general: "An error occurred. Please try again later." }));
                toast.error("An error occurred. Please try again later.");
            }
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
                            />
                            {errors.currentPassword && <p className="error">{errors.currentPassword}</p>}
                            <br /><br />

                            <label htmlFor="newPassword">Enter new password</label><br />
                            <input type="password" id="newPassword" name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} />
                            {errors.newPassword && <p className="error">{errors.newPassword}</p>}
                            <br /><br />

                            <label htmlFor="confirmPassword">Confirm new password</label><br />
                            <input type="password" id="confirmPassword" name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                            <br /><br />

                            <button type="submit" id="submit">Submit</button>
                        </form>
                        {errors.general && <p className="error">{errors.general}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
