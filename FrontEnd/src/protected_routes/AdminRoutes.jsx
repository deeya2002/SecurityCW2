import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Check if user is logged in and has the userType of "admin"
  return user !== null && user.userType === "admin" ? (
    <Outlet />
  ) : (
    navigate('/login')
  );
};

export default AdminRoutes;

