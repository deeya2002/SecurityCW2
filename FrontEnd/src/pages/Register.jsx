import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from "zxcvbn";
import { registerApi } from '../apis/Api';
import '../css/regstyle.css';

const Register = () => {
  //step: 1 creating a state variable
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // step 2 : Create a function for changing the state variable
  const changeFirstName = e => {
    setFirstName(e.target.value);
  };
  const changeLastName = e => {
    setLastName(e.target.value);
  };
  const changeUserName = e => {
    setUserName(e.target.value);
  };
  const changeEmail = e => {
    setEmail(e.target.value);
  };

  const changeconfirmPassword = e => {
    setconfirmPassword(e.target.value);
  };

  //handle after clicking the submit button
  const handleSubmit = e => {
    e.preventDefault();

    setError(""); // Reset the error state before making the API call

    // Assess password strength
    const passwordScore = zxcvbn(password);
    setPasswordStrength(passwordScore.score);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    //step1: check data in console
    console.log(firstname, lastname, email, password);

    // Creating json data (fieldname: values name)
    const data = {
      firstName: firstname,
      lastName: lastname,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    //Step: 2 Send data to backend
    registerApi(data)
      .then(res => {
        console.log(res.data);
        if (res.data.success === true) {
          toast.success(res.data.message);
          navigate('/login');
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
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
        return "dark-green";
      default:
        return "";
    }
  };

  const handlePasswordChange = (e) => {
    // Update password state
    setPassword(e.target.value);

    // Assess password strength on each input change
    const passwordScore = zxcvbn(e.target.value);
    setPasswordStrength(passwordScore.score);
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Food Delivery Login</title>
        {/* Link to the imported CSS file */}
        <link rel="stylesheet" href="regstyle.css" />
      </head>
      <body>
        <div className="main">
          <div className="regs">
            <div className="left" />
            <div className="right">
              <div className="regbox">
                <h1>Register</h1>
                <form action="" id="rg" method="post">
                  <label htmlFor="Fname">FirstName:</label>
                  <input
                    onChange={changeFirstName}
                    type="text"
                    id="ba"
                    name="fname"
                    placeholder="Enter your First Name"
                  />
                  <br />
                  <label htmlFor="Lname">LastName:</label>
                  <input
                    onChange={changeLastName}
                    type="text"
                    id="ba"
                    name="lname"
                    placeholder="Enter your Last Name"
                  />
                  <br />
                  <label htmlFor="Lname">UserName:</label>
                  <input
                    onChange={changeUserName}
                    type="text"
                    id="ba"
                    name="lname"
                    placeholder="Enter your User Name"
                  />
                  <br />
                  <label htmlFor="Email">Email:</label><br />
                  <input
                    onChange={changeEmail}
                    type="text"
                    id="ba"
                    name="mail"
                    placeholder="Enter your mail"
                  />
                  <label htmlFor="password">Password:</label>
                  <input
                    onChange={handlePasswordChange}
                    type="password"
                    id="ba"
                    name="password"
                    placeholder="Enter your password"
                  />
                  {
                    password.length > 0
                    && (
                      <div className="text-sm text-black">
                        Password Strength:{" "}
                        <span
                          className={`text-${getPasswordStrengthColor(
                            passwordStrength
                          )}`}
                        >
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                    )}
                  <label htmlFor="password">Confirm Password:</label>
                  <input
                    onChange={changeconfirmPassword}
                    type="password"
                    id="ba"
                    name="password"
                    placeholder="Re-Enter your password"
                  /> <br />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  {message && (
                    <p className="text-green-500 text-sm mt-2">{message}</p>
                  )}
                  <button onClick={handleSubmit} type="submit" id="sub">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Register;
