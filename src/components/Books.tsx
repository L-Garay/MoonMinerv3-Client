import React from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import Loading from './dataFetching/Loading';
import { useUserAccount } from '../contexts/UserAccount';

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

const Books = () => {
  // useQuery will make query as soon as component is rendered
  // useLazyQuery will only make the query in response to events other than rendering
  const [getBooks, { loading: gqlLoading, error: gqlError, data: bookData }] =
    useLazyQuery(BOOKS);

  const userAccount = useUserAccount();

  return (
    <React.Suspense fallback={<Loading />}>
      <p>User name: {userAccount.user?.name}</p>
      {userAccount.user?.games.length &&
        userAccount.user.games.map((game) => (
          <div key={game.id}>
            <p>Name: {game.name}</p>
            <p>Last played: {game.updatedAt}</p>
          </div>
        ))}
      <button className="btn btn-info" onClick={() => getBooks()}>
        Get Books
      </button>
      {/* {gqlLoading && <h3>Loading...</h3>} */}
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
    </React.Suspense>
  );
};

export default Books;
