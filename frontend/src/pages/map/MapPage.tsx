import React, {useEffect, useState} from 'react';
import Map from './Map';
import {loadMapApi} from '../../utils/GoogleMapsUtil';

export default function MapPage(initialFormValues: any) {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    
    useEffect(() => {
        const googleMapScript = loadMapApi();
        googleMapScript.addEventListener('load', function () {
            setScriptLoaded(true);
        });
    }, []);

    return(
        <div>
            {scriptLoaded && (
                <Map
                    mapType={google.maps.MapTypeId.ROADMAP}
                    mapTypeControl={true}/>
            )}
        </div>
    )
}
