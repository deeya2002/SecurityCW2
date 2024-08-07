import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updatePasswordApi } from '../apis/Api';

import '../css/resetstyle.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const navigate = useNavigate ();
  const location = useLocation ();

  const userEmail = location.state && location.state.User_email;

  const handleChangePassword = e => {
    setNewPassword (e.target.value);
  };

  const handleChangeConfirmPassword = e => {
    setConfirmPassword (e.target.value);
  };

  const handleChangePasswordSubmit = async e => {
    e.preventDefault ();

    try {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast.error ('Passwords do not match');
        return;
      }

      const response = await updatePasswordApi ({
        email: userEmail,
        password: newPassword,
      });

      if (response?.data?.success) {
        toast.success (response?.data?.message);
        navigate ('/login'); 
      } else {
        toast.error (response?.data?.message);
      }
    } catch (error) {
      console.error (error);
      toast.error ('Server Error');
    }
  };

  return (
    <div className="main">
      <div className="resetpsw">
        <div className="left" />
        <div className="right">
          <div className="rbox">
            <h1>Create a new password</h1>
            <form onSubmit={handleChangePasswordSubmit} id="newp">
              <label htmlFor="password">Enter new password</label>
              <input
                type="password"
                id="newps"
                name="Enterpassword"
                value={newPassword}
                onChange={handleChangePassword}
              />
              <br />
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                type="password"
                id="newps"
                name="ConfirmPassword"
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
              />
              <br />
              <button type="submit" id="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
