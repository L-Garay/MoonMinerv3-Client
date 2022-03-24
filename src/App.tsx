import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

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
  return (
    <div className="App">
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
    <Router>
      <Routes>
        <Route path="/" element={HomePage()} />
        <Route path="/loggedIn" element={LoggedIn()} />
      </Routes>
    </Router>
  );
}

export default App;
