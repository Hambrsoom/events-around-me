import NodeGeocoder from "node-geocoder";
import CoordinatesInput from "../types/coordinates-input.type";

const options = {
  provider: "openstreetmap",
};

export const findCoordinates = async(addressInString: string): Promise<CoordinatesInput> => {
  const geocoder = NodeGeocoder(options);
  const result = await geocoder.geocode(addressInString);
  return {
    latitude: result[0].latitude,
    longitude: result[0].longitude,
  };
};

export default findCoordinates;
