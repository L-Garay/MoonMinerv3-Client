import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import MainNavigation from './MainNavigation';
import AuthNavigation from './AuthNavigation';

const NavigationBar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-container my-2">
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container m-0">
          <div className="navbar-brand logo" />
          {isAuthenticated && <MainNavigation />}
          <AuthNavigation />
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
