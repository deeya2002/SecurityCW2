import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from "zxcvbn";
import { registerApi } from '../../apis/Api';
import '../../css/regstyle.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Register = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [message] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const changeFirstName = e => setFirstName(e.target.value);
  const changeLastName = e => setLastName(e.target.value);
  const changeUserName = e => setUserName(e.target.value);
  const changeEmail = e => setEmail(e.target.value);
  const changeConfirmPassword = e => setConfirmPassword(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    setError("");

    const passwordScore = zxcvbn(password);
    setPasswordStrength(passwordScore.score);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      firstName: firstname,
      lastName: lastname,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    registerApi(data)
      .then(res => {
        if (res.data.success === true) {
          toast.success(res.data.message);
          navigate('/login');
        } else {
          setError(res.data.message);
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          toast.error("An internal error occurred. Please try again.");
        }
      });
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "green";
      case 4:
        return "darkgreen";
      default:
        return "";
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordScore = zxcvbn(e.target.value);
    setPasswordStrength(passwordScore.score);
  };

  const strengthColor = getPasswordStrengthColor(passwordStrength);
  const progressBarWidth = `${(passwordStrength + 1) * 20}%`;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="main">
      <div className="regs">
        <div className="left" />
        <div className="right">
          <div className="regbox">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Fname">First Name:</label>
              <input
                onChange={changeFirstName}
                type="text"
                id="ba"
                name="fname"
                placeholder="Enter your First Name"
              />
              <br />
              <label htmlFor="Lname">Last Name:</label>
              <input
                onChange={changeLastName}
                type="text"
                id="ba"
                name="lname"
                placeholder="Enter your Last Name"
              />
              <br />
              <label htmlFor="username">User Name:</label>
              <input
                onChange={changeUserName}
                type="text"
                id="ba"
                name="username"
                placeholder="Enter your User Name"
              />
              <br />
              <label htmlFor="email">Email:</label><br />
              <input
                onChange={changeEmail}
                type="email"
                id="ba"
                name="email"
                placeholder="Enter your email"
              />
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  onChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  id="ba"
                  name="password"
                  placeholder="Enter your password"
                />
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {password.length > 0 && (
                <div className="text-sm">
                  <div 
                    className="progress-bar"
                    style={{ width: progressBarWidth, backgroundColor: strengthColor }}
                  />
                  <span style={{ color: strengthColor }}>
                    Password Strength: {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
              )}
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="password-container">
                <input
                  onChange={changeConfirmPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  id="ba"
                  name="confirmPassword"
                  placeholder="Re-Enter your password"
                />
                <span
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <br />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
              <button type="submit" id="sub">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
