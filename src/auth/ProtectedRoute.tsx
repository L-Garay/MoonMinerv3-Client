import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// NOTE Does not seem to work with React router v6
// ERROR: [ProtectedRoute] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (!user && !isAuthenticated && !isLoading) {
    loginWithRedirect();
  }
  return children;
};

export default ProtectedRoute;
