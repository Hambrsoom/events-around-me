import distance from "google-distance-matrix";
import { Event } from "../../entities/event.entity";
import IResult from "../../types/google_maps_matrix_results";

export class MapService {
    public static async getDistnacesFromSourceToDistnaces(
        origins: string[],
        destinations: string[]
        ): Promise<IResult> {
            return new Promise((resolve) => {
                distance.key(process.env.GOOGLE_MAPS_API_KEY);
                const result: IResult = MapService.callMatrixDistance(origins, destinations);

                setTimeout(()=> {
                    resolve(result);
                }, 1000);
            }).then((result: IResult) => {
                return result;
            });
    }

    public static callMatrixDistance(
        origins: string[],
        destinations: string[]
        ): IResult {
            let result: IResult = {
                destination_addresses: [],
                results:[]
            };

            distance.matrix(origins, destinations, async (err, distances)  => {
                if (!err) {
                    result.destination_addresses = await distances.destination_addresses;
                    result.results = await distances.rows[0].elements;
                } else {
                    console.log(err);
                }
            });

            return result;
    }

    public static async getTheClosestEventsToTheUser(
        origin: string,
        events: Event[],
        desiredDistanceInKm: number
        ): Promise<Event[]> {
            let dictionaryOfEvents: {[id: string] : Event[]} = MapService.createADictionaryOfEvents(events);
            const result: IResult = await MapService.getDistnacesFromSourceToDistnaces(
                [origin],
                Object.keys(dictionaryOfEvents)
            );
            dictionaryOfEvents = MapService.filterEventsAccordingToDistance(
                dictionaryOfEvents,
                result,
                desiredDistanceInKm
            );
            return MapService.returnListOfEvents(dictionaryOfEvents);
    }

    public static filterEventsAccordingToDistance(
        dictionaryOfEvents: {[id: string] : Event[]},
        result: IResult,
        desiredDistanceInKm: number
        ):  {[id: string] : Event[]} {
            result.destination_addresses.forEach((element, index) => {
                if(result.results[index].distance.value/1000 > desiredDistanceInKm) {
                    delete dictionaryOfEvents[element.toLowerCase()];
                }
            });

            return dictionaryOfEvents;
    }

    public static returnListOfEvents(dictionaryOfEvents: {[id: string] : Event[]}): Event[] {
        let events: Event[] = [];
        Object.values(dictionaryOfEvents).forEach(listOfEvents =>{
            events = events.concat(listOfEvents);
        });

        return events;
    }

    public static createADictionaryOfEvents(
        events: Event[]
        ):  {[id: string] : Event[]} {
            let dictionaryOfEvents: { [name: string]: Event[] } = {};
            events.forEach(event => {
                if(dictionaryOfEvents[event.address.convertAddressToString()]) {
                    dictionaryOfEvents[event.address.convertAddressToString()].push(event);
                } else {
                    dictionaryOfEvents[event.address.convertAddressToString()] = [event];
                }
            });
            return dictionaryOfEvents;
    }
}