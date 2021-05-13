import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, ApolloLink, concat, createHttpLink } from '@apollo/client';
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import SnackBar from './components/snackbar/SnackBar';
import { Severity } from './models/ErrorNotification';

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


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      <SnackBar severity={Severity.Error} message={message}/>
      
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});


export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(link)),
  cache: new InMemoryCache()
});
