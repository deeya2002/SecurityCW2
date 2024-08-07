import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../../apis/Api';
import '../../css/loginstyle.css';

const LoginForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeUserName = e => {
    setUserName(e.target.value);
  };

  const changePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    const data = {
      username: username,
      password: password,
    };

    loginApi(data)
      .then(res => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          localStorage.setItem('token', res.data.token);
          const convertedJson = JSON.stringify(res.data.userData);
          localStorage.setItem('user', convertedJson);
          navigate('/');
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };
  return (
    <div className="main">
      <div className="login">
        <div className="left" />
        <div className="right">
          <div className="logbox">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} id="lgn">
              <label htmlFor="Username">Username:</label><br />
              <input
                id="ab"
                name="username"
                onChange={changeUserName}
                type="username"
                placeholder="Enter your username"
              /><br />
              <label htmlFor="password">Password:</label><br />
              <input
                type="password"
                id="ab"
                name="password"
                onChange={changePassword}
                placeholder="Enter your password"
              />
              {error && (
                <p className="text-red-500 ">{error}</p>
              )}
              <div className="reset_link">
                <Link to="/sendemail">Forgot password?</Link>
              </div>
              <button onClick={handleSubmit} type="submit" id="submit">
                Log In
              </button>
              <div className="gue_link" >
                <FaUser className="text-xl" />
                <Link className="gue_link" to='/'> Continue as Guest</Link>
              </div>
              <div className="reg_link">
                Not a member? <Link to="/register">Register now</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
