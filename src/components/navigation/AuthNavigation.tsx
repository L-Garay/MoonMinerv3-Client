import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import AuthenticationButton from '../accounts/AuthenticationButtons';
import SignupButton from '../accounts/SignupButton';

const AuthNavigation = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="navbar-nav">
      {!isAuthenticated && (
        <span style={{ paddingRight: '10px' }}>
          <SignupButton />
        </span>
      )}
      <AuthenticationButton />
    </div>
  );
};

export default AuthNavigation;
