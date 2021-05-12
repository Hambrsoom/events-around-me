import './App.css';

import NavBar from './components/navbar/NavBar';
import { setContext } from "apollo-link-context";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, ApolloLink, concat, createHttpLink } from '@apollo/client';
import MapPage from './pages/map/MapPage';
import IsAuthenticated from './components/authentication/IsAuthenticated';
import DashboardPage from './pages/dashboard/DashboardPage';
import SignIn from './pages/authentication/signin/Signin';
import SignUp from './pages/authentication/signup/Signup';
import Temp from './components/navbar/menu/EventModal/temp';
import { client }  from './ApolloClient';
const { createUploadLink } = require('apollo-upload-client');

    


// const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" })
// const authLink = setContext(async (req, { headers }) => {
// 	const token = localStorage.getItem("token")

// 	return {
// 		...headers,
// 		headers: {
// 			Authorization: token ? `${token}` : null
// 		}
// 	}
// })

// const link = authLink.concat(httpLink as any)
// const client = new ApolloClient({
// 	link: link as any,
// 	cache: new InMemoryCache()
// })


function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    <Switch>
                        <Route path='/signin' exact component={SignIn} />
                        <Route path='/signup' exact component={SignUp} />
                        <IsAuthenticated>
                            <NavBar/>
                            <Route path='/map' exact component={MapPage} />
                            <Route path='/dashboard' exact component={DashboardPage}/>
                            <Route path='/temp' exact component={Temp}/>
                        </IsAuthenticated>
                    </Switch>
                </div>
            </Router>     
        </ApolloProvider>
    );
}

export default App;