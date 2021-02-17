import { Event } from "../../entities/event.entity";
import { getAsync, setAsync, delAsync } from "../../redis-connection";

export class EventCashingService {
    public static async getEvents(
        ): Promise<Event[]> {
            const isValid: boolean = await EventCashingService.isValid();
            if(isValid) {
                let events:any = await getAsync("events");
                return events? JSON.parse(events): null;
            }
    }

    public static async setEvents(
        events: Event[]
        ): Promise<void> {
            await setAsync("events", JSON.stringify(events));
            await setAsync("valid", true);
    }

    public static async setNotUpToDate(
        ): Promise<void> {
            await setAsync("valid", false);
            await delAsync("events");
    }

    public static async isValid(
        ): Promise<boolean> {
            return await getAsync("valid") === true;
    }

    public static async getEventById(
        eventId: string
        ): Promise<Event> {
            const isValid: boolean = await EventCashingService.isValid();
            if(isValid) {
                let events: Event[] = JSON.parse(await getAsync("events"));
                if(events !== undefined) {
                    return events.find(event => event.id === eventId);
                }
            }
    }

    public static async getEventsByTitle(
        text: string
        ): Promise<Event[]> {
            const isValid: boolean = await EventCashingService.isValid();

            if(isValid) {
                let events: Event[] = JSON.parse(await getAsync("events"));
                if(events !== undefined && events.length > 0) {
                    const eventsByTitle: Event[] = events.filter(
                            event => (event.title.toLowerCase()).includes(text.toLowerCase())
                        );
                    return eventsByTitle;
                }
            }
    }

    public static async getAllEventsForOrganization(
        organizerId: string
        ): Promise<Event[]> {
            const isValid: boolean = await EventCashingService.isValid();

            if(isValid) {
                let events: Event[] = JSON.parse(await getAsync("events"));
                if(events !== undefined && events.length > 0) {
                    const eventsByTitle: Event[] = events.filter(
                            event => (event.organizer.id === organizerId)
                        );
                    return eventsByTitle;
                }
            }
    }
}