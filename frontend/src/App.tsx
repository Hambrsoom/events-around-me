import './App.css';

import NavBar from './components/navbar/NavBar';
import SignUpOrIn from './components/credentials/SignUpOrIn';
import { setContext } from "apollo-link-context";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import MapPage from './pages/map/MapPage';
import IsAuthenticated from './components/authentication/IsAuthenticated';
import DashboardPage from './pages/dashboard/DashboardPage';
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
})

const authLink = setContext(async(req, {headers})=>{
    const token = localStorage.getItem('token');

    return {
        ...headers,
        headers: {
            Authorization: token? `${token}` : null
        }
    }
})

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});


function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    <DashboardPage></DashboardPage>
                    {/* <NavBar/>
                    <Switch>
                        <Route path="/authentication" exact component={SignUpOrIn} />
                        <IsAuthenticated>
                            <Route path="/map" exact component={MapPage} />
                        </IsAuthenticated>
                        <IsAuthenticated>
                            <Route path="/dashboard" exact component={DashboardPage}/>
                        </IsAuthenticated>
                    </Switch> */}
                </div>
            </Router>     
        </ApolloProvider>
    );
}

export default App;