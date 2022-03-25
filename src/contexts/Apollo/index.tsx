import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;

const ApolloContext = ({ children }) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: API_SERVER_URI,
  });

  return <ApolloProvider client={client} children={children} />;
};

export default ApolloContext;
