import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestPasswordResetApi } from '../../apis/Api';
import '../../css/sendemailstyle.css';
const SendEmail = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const changeEmail = e => {
        setEmail(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            email: email,
        };

        requestPasswordResetApi(data)
            .then(res => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                    navigate('/verifytoken', { state: { User_email: email } });
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Server Error');
            });
    };

    return (
        <div className="main">
            <div className="reset">
                <div className="left" />
                <div className="right">
                    <div className="resetbox">
                        <h1>Forgot Your Password?</h1>
                        <form id="fgt">
                            <label htmlFor="Email">
                                Please enter your email to search for your account.
                            </label>
                            <br />
                            <br />
                            <input
                                onChange={changeEmail}
                                type="text"
                                id="bb"
                                name="mail"
                                placeholder="Enter your mail"
                            />
                            <br />
                            <br />
                            <button type="submit" onClick={handleSubmit} id="reset">
                                Reset
                            </button>
                            <div className="lgn_link"><Link to="/login">Back to Login</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
