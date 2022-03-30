import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const API_SERVER_URI = process.env.REACT_APP_SERVER_URI;
const API_WEBSOCKET_URI = process.env.REACT_APP_WEBSOCKET_URI;

const ApolloContext = ({ children }) => {
  const httpLink = new HttpLink({
    uri: API_SERVER_URI,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:5000/subscriptions',
      // url: API_WEBSOCKET_URI!, don't like this non-null declaration
      // NOTE to authenticate over WebSocket
      //https://www.apollographql.com/docs/react/data/subscriptions
      // connectionParams: {
      //   authToken: PUT AUTH TOKEN HERE
      // }
    })
  );

  // The split function takes three parameters:
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: API_SERVER_URI,
    link: splitLink,
  });

  return <ApolloProvider client={client} children={children} />;
};

export default ApolloContext;
