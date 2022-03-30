import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useMatch,
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { UserAccountProvider } from './contexts/UserAccount';

import ProtectedRoute from './auth/ProtectedRoute';
import NavigationBar from './components/navigation/NavigationBar';
// import Loading from './components/dataFetching/Loading';
import Authenticating from './components/dataFetching/Authenticating';
import AuthenticationButton from './components/accounts/AuthenticationButtons';
import SignupButton from './components/accounts/SignupButton';
import Books from './components/Books';

const MainContent = () => {
  const { user, loginWithRedirect } = useAuth0();

  const routeMatches = useMatch('/home');

  if (!user && routeMatches) {
    return <Authenticating />;
  }
  return (
    <React.Fragment>
      {user && (
        <div className="App">
          <NavigationBar />
          <header className="App-header">
            <h1>Congrats, you logged in or signed up</h1>
            <p>
              Ultimately, this is where the user will have the option to start a
              new game, load a saved game, or view/edit their profile and
              view/edit settings. Think of it like the main menu. (So we'll need
              to fetch all that data as soon as the user has logged in/signed
              up)
            </p>
            {/* NOTE below will be where the menu buttons are located */}
            {/* 1. Create new game */}
            {/* 2. Load saved games */}
            {/* 3. Edit settings/account */}
            <Books />
          </header>
        </div>
      )}
    </React.Fragment>
  );
};

const TitlePage = () => {
  const { isLoading, error, user, isAuthenticated } = useAuth0();

  // TODO ensure this logic/order works and clean up
  if (isLoading) return <Authenticating />;
  if (error) return <div>Oops... {error.message}</div>;
  if (user && isAuthenticated) return <Navigate to="/home" />;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome, to Moon Miner v3!</h1>
        <div>
          <AuthenticationButton />
          <SignupButton />
        </div>
      </header>
    </div>
  );
};

function App() {
  return (
    <React.Fragment>
      <UserAccountProvider>
        <Routes>
          <Route path="/" element={TitlePage()} />
          {/* NOTE this works, but when there are numerous routes that need protection this will need to be revisted */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserAccountProvider>
    </React.Fragment>
  );
}

export default App;
