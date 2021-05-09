import React, {useEffect, useState} from 'react';
import './App.css';
import Map from './pages/map/Map';
import {loadMapApi} from './utils/GoogleMapsUtil';
import NavBar from './components/navbar/NavBar';
function App() {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const googleMapScript = loadMapApi();
        googleMapScript.addEventListener('load', function () {
            setScriptLoaded(true);
        });
    }, []);

    return (
        <div>
        <NavBar/>
        <div className="App">
            {scriptLoaded && (
                <Map
                  mapType={google.maps.MapTypeId.ROADMAP}
                  mapTypeControl={true}
                />
            )}
        </div>
        </div>
        
    );
}

export default App;