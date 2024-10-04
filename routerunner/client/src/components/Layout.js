// components/Layout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BurgerMenu from './BurgerMenu'; // Import the burger menu

const Layout = () => {
  const location = useLocation();
  const fullyAccessibleRoutes = ['/', '/login', '*'];

  // Determine whether to show the menu
  const shouldShowMenu = !fullyAccessibleRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowMenu && <BurgerMenu />}
      {/* Render the children components */}
      <Outlet />
    </div>
  );
};

export default Layout;
