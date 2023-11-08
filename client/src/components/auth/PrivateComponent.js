import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function PrivateComponent() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  if (!isLoggedIn) {
    navigate('/auth');
    return null; // Return null when not logged in to prevent rendering of <Outlet>
  }

  return <Outlet />;
}

export default PrivateComponent;
