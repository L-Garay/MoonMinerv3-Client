import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isLoggedIn ? (
          <h1>Congratulations, you are logged in!</h1>
        ) : (
          <>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React with TypeScript
            </a>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
