import './App.css';
import NavBar from './components/navbar/NavBar';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import MapPage from './pages/map/MapPage';
import IsAuthenticated from './components/authentication/IsAuthenticated';
import DashboardPage from './pages/dashboard/DashboardPage';
import SignIn from './pages/authentication/signin/Signin';
import SignUp from './pages/authentication/signup/Signup';
import { client }  from './ApolloClient';
import { useState } from 'react';
import { Search } from '@material-ui/icons';
import Event from './pages/event/event';

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
                            <Route path='/event/:id' component={Event}/>
                        </IsAuthenticated>
                    </Switch>
                </div>
            </Router>     
        </ApolloProvider>
    );
}

export default App;