import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import NavigationBar from './components/navigation/NavigationBar';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './components/Loading';

function LoggedIn() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Congrats, you logged in</h1>
      </header>
    </div>
  );
}
function HomePage() {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <NavigationBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={HomePage()} />
      <Route path="/loggedIn" element={LoggedIn()} />
    </Routes>
  );
}

export default App;
