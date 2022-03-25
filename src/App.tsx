import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import NavigationBar from './components/navigation/NavigationBar';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './components/Loading';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

function MainMenu() {
  const { user } = useAuth0();
  console.log(user);

  if (!user) return <Navigate to="/" />;
  return (
    <div className="App">
      <header className="App-header">
        <h1>Congrats, you logged in or signed up</h1>
        <h3>
          Here is your account information, to see how to get account data right
          after login/signup
        </h3>
        <div>
          <small style={{ paddingRight: '10px' }}>Name: {user.name}</small>
          <small>Email: {user.email}</small>
        </div>
        <p>
          Ultimately, this is where the user will have the option to start a new
          game, load a saved game, or view/edit their profile and view/edit
          settings. Think of it like the main menu. (So we'll need to fetch all
          that data as soon as the user has logged in/signed up)
        </p>
      </header>
    </div>
  );
}

// Define Query
const BOOKS = gql`
  query GetBooks {
    books {
      title
      content
      published
      author {
        name
      }
    }
  }
`;

interface UserAccount {
  name: string;
  email: string;
}

function HomePage() {
  const { isLoading, error, user } = useAuth0();
  const [userAccount, setUserAccount] = React.useState<UserAccount | undefined>(
    undefined
  );

  // useQuery will make query as soon as component is rendered
  // useLazyQuery will only make the query in response to events other than rendering
  const [getBooks, { loading: gqlLoading, error: gqlError, data: bookData }] =
    useLazyQuery(BOOKS);

  if (isLoading) return <Loading />;
  if (error) return <div>Oops... {error.message}</div>;
  if (user) return <Navigate to="mainMenu" />;

  return (
    <div className="App">
      {/* <NavigationBar /> */}
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
        <button className="btn btn-info" onClick={() => getBooks()}>
          Get Books
        </button>
        {gqlLoading && <h3>Loading...</h3>}
        {bookData &&
          bookData.books.map((book) => {
            return (
              <div key={book.title} className="mb-4">
                <p>Title: {book.title}</p>
                <p>Content: {book.content}</p>
                <p>Author: {book.author.name}</p>
              </div>
            );
          })}
      </header>
    </div>
  );
}

function App() {
  return (
    <React.Fragment>
      <NavigationBar />

      <Routes>
        <Route path="/" element={HomePage()} />
        <Route path="/mainMenu" element={MainMenu()} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
