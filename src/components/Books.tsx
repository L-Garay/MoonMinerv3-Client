import React from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Loading from './dataFetching/Loading';
import { useUserAccount } from '../contexts/UserAccount';

// Define Query
// const BOOKS = gql`
//   query GetBooks {
//     books {
//       title
//       content
//       published
//       author {
//         name
//       }
//     }
//   }
// `;

// Define mutation
// I don't believe we'll need to get anything back specifically
// Want to setup subscriber to watch userAccount, which should hold newly created game
const CREATE_GAME = gql`
  mutation CreateNewGame($name: String!, $id: Int!) {
    createGame(name: $name, id: $id) {
      id
      name
      createdAt
      updatedAt
      userAccountId
    }
  }
`;

const Books = () => {
  const [gameName, setGameName] = React.useState<string>('');
  // useQuery will make query as soon as component is rendered
  // useLazyQuery will only make the query in response to events other than rendering
  // const [getBooks, { loading: gqlLoading, error: gqlError, data: bookData }] =
  //   useLazyQuery(BOOKS);
  // const { loading, error, data: bookData } = useQuery(BOOKS);
  const [createGame] = useMutation(CREATE_GAME);

  const userAccount = useUserAccount();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const game = await createGame({
      variables: { name: gameName, id: userAccount.user?.id },
    });
    if (game.data.createGame) {
      setGameName('');
    }
  };

  return (
    <React.Suspense fallback={<Loading />}>
      <p>User name: {userAccount.user?.name}</p>
      <div className="d-flex">
        <div>
          {userAccount.user?.games.length &&
            userAccount.user.games.map((game) => (
              <div key={game.id} className="mb-4">
                <p>Name: {game.name}</p>
                <p>Last played: {game.updatedAt}</p>
              </div>
            ))}
          {/* <button className="btn btn-info" onClick={() => getBooks()}>
        Get Books
      </button> */}
          {/* {loading && <h3>Loading...</h3>} */}
          {/* {bookData &&
            bookData.books.map((book) => {
              return (
                <div key={book.title} className="mb-4">
                  <p>Title: {book.title}</p>
                  <p>Author: {book.author.name}</p>
                </div>
              );
            })} */}
        </div>
        <div>
          <form action="#" onSubmit={handleSubmit}>
            <fieldset>
              <label>
                Game save name:
                <input
                  type="text"
                  value={gameName}
                  onChange={({ target }) => setGameName(target.value)}
                  className="ml-4"
                />
              </label>
            </fieldset>
            <button type="submit">Create Game</button>
          </form>
        </div>
      </div>
    </React.Suspense>
  );
};

export default Books;
