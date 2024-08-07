import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {verifyCodeApi} from '../apis/Api';
import '../css/codestyle.css'; 

const ForgotPasswordCode = () => {
  const [verificationCode, setVerificationCode] = useState ('');
  const navigate = useNavigate ();
  const location = useLocation ();

  const userEmail = location.state && location.state.User_email;

  const handleChangeCode = e => {
    setVerificationCode (e.target.value);
  };

  const handleVerifyCode = e => {
    e.preventDefault ();

    const data = {
      resetCode: verificationCode,
      email: userEmail,
    };

    verifyCodeApi (data)
      .then (res => {
        if (res.data.success === false) {
          toast.error (res.data.message);
        } else {
          toast.success (res.data.message);
          navigate ('/resetpassword', {state: {User_email: userEmail}});
        }
      })
      .catch (err => {
        console.error (err);
        toast.error ('Server Error');
      });
  };

  return (
    <div className="main">
      <div className="code">
        <div className="left" />
        <div className="right">
          <div className="vbox">
            <h1>Enter Verification Code</h1>
            <form onSubmit={handleVerifyCode} id="vgt">
              <label htmlFor="Code">
                Please enter the code we've sent to your email.
              </label>
              <input
                type="text"
                id="num"
                name="code"
                placeholder="Enter Verification code"
                value={verificationCode}
                onChange={handleChangeCode}
              />
              <br />
              <button onSubmit={handleVerifyCode} type="submit" id="verify">
                Verify
              </button>
              <div className="resend_link">
                Didn't get a code? <a href="/sendemail">Click to resend</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordCode;
