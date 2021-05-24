import CoordinatesInput from "../types/coordinates-input.type";

const getDistanceFromCoordinatesInKm = (
    originCoordinates: CoordinatesInput,
    distinationCoordinates: CoordinatesInput,
    ): number => {
        const radiusOfEarth = 6371;
        const distanceLatitude = degreeToradius(distinationCoordinates.latitude - originCoordinates.latitude);
        const distnaceLongitude = degreeToradius(distinationCoordinates.longitude - originCoordinates.longitude);
        const a: number =
        Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
        Math.cos(degreeToradius(originCoordinates.latitude)) * Math.cos(degreeToradius(distinationCoordinates.latitude)) *
        Math.sin(distnaceLongitude / 2) * Math.sin(distnaceLongitude / 2)
        ;
        const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance: number = radiusOfEarth * c;
        return distance;
};


const degreeToradius = (degree: number) => {
    return degree * (Math.PI / 180);
};

export default getDistanceFromCoordinatesInKm;
