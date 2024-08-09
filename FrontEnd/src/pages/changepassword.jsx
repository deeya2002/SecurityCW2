import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updatePassword } from '../apis/Api';

export default function ChangePassword() {
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
            const response = await updatePassword(data);

            if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                navigate('/');
            }
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const handleReset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
    };


    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-[#F6F7D3]">
            <div className="bg-[#F6F7D3] hidden lg:block w-full md:w-1/2 xl:w-2/3">
                {/* <img src={Bg} alt="background" className="w-full h-full object-cover" /> */}
            </div>
            <div className="bg-[#F6F7D3] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12 flex items-center justify-center my-4">
                <div className="w-full h-100">
                    {/* <img src={Logo} alt="Logo" className="relative -left-4" /> */}
                    <h1 className="text-4xl md:text-4xl font-bold leading-tight mt-4 mb-3 text-[#305973]">
                        Change Password
                    </h1>
                    <h2 className="text-3xl md:text-3xl font-medium leading-tight">
                        CHANGE YOUR PASSWORD
                    </h2>

                    <form className="mt-4 bg-[#F6F7D3]" onSubmit={handlePasswordChange}>
                        <div>
                            <label className="block text-[#305973] text-3xl">
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your current password"
                                className="w-full p-3 mt-2 mb-4 border rounded"
                                autoFocus
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[#305973] text-3xl mt-3">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                className="w-full p-3 mt-2 mb-4 border rounded"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="mt-2">
                            <label className="block text-[#305973] text-3xl mt-3">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full p-3 mt-2 mb-4 border rounded"
                                minLength="6"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#305973] text-white p-3 rounded mt-4"
                        >
                            CHANGE PASSWORD
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
