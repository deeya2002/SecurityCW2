import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../../apis/Api';
import '../../css/loginstyle.css';

const LoginForm = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: "", password: "", general: "" });
  const navigate = useNavigate();

  const changeUserName = e => {
    setUserName(e.target.value);
  };

  const changePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErrors({ username: "", password: "", general: "" });

    const data = {
      username: username,
      password: password,
    };

    loginApi(data)
      .then(res => {
        if (res.data.success === false) {
          setErrors(prevErrors => ({ ...prevErrors, general: res.data.message }));
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
          setErrors(prevErrors => ({ ...prevErrors, ...err.response.data.error }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, general: "An error occurred. Please try again later." }));
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
              <label htmlFor="username">Username:</label><br />
              <input
                id="ab"
                name="username"
                onChange={changeUserName}
                type="text"
                placeholder="Enter your username"
              /><br />
              {errors.username && <p className="text-red-500 ">{errors.username}</p>}

              <label htmlFor="password">Password:</label><br />
              <input
                type="password"
                id="ab"
                name="password"
                onChange={changePassword}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 ">{errors.password}</p>}

              {errors.general && <p className="text-red-500 ">{errors.general}</p>}

              <div className="reset_link">
                <Link to="/sendemail">Forgot password?</Link>
              </div>
              <button type="submit" id="submit">
                Log In
              </button>
              <div className="gue_link">
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
