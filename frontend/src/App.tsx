import React, {useEffect, useState} from 'react';
import './App.css';
import Map from './pages/map/Map';
import {loadMapApi} from './utils/GoogleMapsUtil';
import NavBar from './components/navbar/NavBar';
import SignUpOrIn from './components/credentials/SignUpOrIn';
import { setContext } from "apollo-link-context";

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';

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
console.log(link)
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});


function App() {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    
    useEffect(() => {
        const googleMapScript = loadMapApi();
        googleMapScript.addEventListener('load', function () {
            setScriptLoaded(true);
        });
    }, []);

    return (
        <ApolloProvider client={client}>
            <div>
                <NavBar/>
                <div className="App">
                    {scriptLoaded && (
                        <Map
                        mapType={google.maps.MapTypeId.ROADMAP}
                        mapTypeControl={true}
                        />
                    )}
                    {/* <SignUpOrIn/> */}
                </div>
            </div>
        </ApolloProvider>
        
        
    );
}

export default App;