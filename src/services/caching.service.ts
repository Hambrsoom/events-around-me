import { promisify } from "util";
import { Event } from "../entities/event.entity";
import { redisClient } from "../redis-connection";

export class CashingService { 
    public static async getEvents()
        : Promise<Event[]> {

        const getAsync = promisify(redisClient.get).bind(redisClient);
        const isValid: boolean = await CashingService.isValid();
        if(isValid) {
            let events = await getAsync("events");
            return events? JSON.parse(events): null;
        }
    }

    public static async setEvents(
        events: Event[]
        ): Promise<void> {

        const setAsync = promisify(redisClient.set).bind(redisClient);
        await setAsync("events", JSON.stringify(events));
        await setAsync("valid", true);
    }

    public static async setNotValid()
        : Promise<void> {

        const setAsync = promisify(redisClient.set).bind(redisClient);
        const delAsync = promisify(redisClient.del).bind(redisClient);
        await setAsync("valid", false);
        await delAsync("events");
    }

    public static async isValid()
        : Promise<boolean> {

        const getAsync = promisify(redisClient.get).bind(redisClient);
        return await getAsync("valid") === true;
    }

    public static async getEventById(
        eventId: number)
        : Promise<Event> {
            
        const isValid: boolean = await CashingService.isValid();

        if(isValid) {
            const getAsync = promisify(redisClient.get).bind(redisClient);
            let events: Event[] = JSON.parse(await getAsync("events"));
            if(events != undefined) {
                return events.find(event => event.id == eventId);
            }
        }
    }

    public static async getEventsByTitle(
        text: string
        ): Promise<Event[]> {
        
        const isValid: boolean = await CashingService.isValid();

        if(isValid){
            const getAsync = promisify(redisClient.get).bind(redisClient);
            let events: Event[] = JSON.parse(await getAsync("events"));
    
            if(events != undefined && events.length > 0) {
                const eventsByTitle = events.filter(event => (event.title.toLowerCase()).includes(text.toLowerCase()));
                return eventsByTitle;
            } 
        }
    }

}