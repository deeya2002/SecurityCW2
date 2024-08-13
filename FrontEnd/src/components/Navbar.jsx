import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutApi, searchByFoodName } from "../apis/Api";

const Navbar = ({ size, setShow }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Logout function
  const navigate = useNavigate();
  // const handleLogout = e => {
  //    e.preventDefault();
  //   localStorage.clear();
  //   navigate("/login");
  //   window.location.reload();
  // };
  const handleLogout = async () => {
    try {
      // Call the logoutApi function to initiate the logout request
      await logoutApi();

      // Perform any additional actions needed after logout
      console.log('Logout successful');
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      // Handle any errors that occurred during the logout request
      console.error('Logout failed', error);
      // Show an error message or notification to the user
    }
  };

  // Get user data from local storage
  const user = JSON.parse(localStorage?.getItem("user")) || null;

  const searchDat = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('foodName', searchQuery);

    try {
      const response = await searchByFoodName(formData);

      if (response.data?.foodNames && response.data.foodNames.length > 0) {
        const firstResultId = response.data.foodNames[0]._id;
        navigate(`/descriptionpage/${firstResultId}`);
      } else {
        // Handle the case when no results are found
        console.log('No matching results found');
      }
    } catch (error) {
      // Handle errors from the API request
      console.error('Error fetching data:', error);
    }
  };

  const handlePassword = () => {
    navigate("/sendemail");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-transparent">
        <div className="container-fluid">
          <Link className="navbar-brand text-danger fw-bold" to="/">
            Swift Serve
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/restaurant">
                  Restaurant
                </Link>
              </li>
              {user && user.userType === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/restaurant">
                    Add Restaurant
                  </Link>
                </li>
              ) : null}
              {user && user.userType === "user" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    Cart
                  </Link>
                </li>
              ) : null}
              {user && user.userType === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/orderlist">
                    Order List
                  </Link>
                </li>
              ) : null}
              {user && user.userType === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>
              ) : null}
              {user && user.userType === "user" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/review">
                    Review
                  </Link>
                </li>
              ) : null}
              {user && user.userType === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/reviewlist">
                    Review List
                  </Link>
                </li>
              ) : null}
            </ul>
            <form className="d-flex gap-5" role="search" onSubmit={searchDat}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{ width: "500px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <div className="ms-2">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Welcome, {user.firstName} {user.lastName}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        onClick={handleProfile}
                        className="dropdown-item"
                        to="/profile"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={handlePassword}
                        className="dropdown-item"
                        to="/changepassword"
                      >
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item"
                        to="/logout"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link className="btn btn-outline-danger" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-outline-success ms-2" to="/register">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
