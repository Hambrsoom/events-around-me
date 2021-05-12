import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, ApolloLink, concat, createHttpLink } from '@apollo/client';
import { setContext } from "apollo-link-context";

const { createUploadLink } = require('apollo-upload-client');

const link = createUploadLink({uri: "http://localhost:4000/graphql"})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat((link)),
  cache: new InMemoryCache()
});
