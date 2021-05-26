import { Event } from "../../entities/event.entity";
import { cache, del, readCache } from "../../redis-connection";

export class EventCachingService {
  public static async getEvents(
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isValid();
      if (isValid) {
        let events: any = await readCache("events");
        return events ? JSON.parse(events) : null;
      }
  }

  public static async cachingEvents(
    events: Event[],
    ): Promise<void> {
      await cache("events", JSON.stringify(events));
      await cache("valid", true);
  }

  public static async setNotUpToDate(
    ): Promise<void> {
      await cache("valid", false);
      await del("events");
  }

  public static async isValid(
    ): Promise<boolean> {
      return await readCache("valid") === true;
  }

  public static async getEventById(
    eventId: string,
    ): Promise<Event> {
      const isValid: boolean = await EventCachingService.isValid();
      if (isValid) {
        let events: Event[] = JSON.parse(await readCache("events"));
        if (events !== undefined) {
          return events.find((event) => event.id === eventId);
        }
      }
  }

  public static async getEventsByTitle(
    text: string,
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isValid();

      if (isValid) {
        let events: Event[] = JSON.parse(await readCache("events"));
        if (events !== undefined && events.length > 0) {
          const eventsByTitle: Event[] = events.filter(
            (event) => (event.title.toLowerCase()).includes(text.toLowerCase()),
          );
          return eventsByTitle;
        }
      }
  }

  public static async getAllEventsForOrganization(
    organizerId: string,
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isValid();

      if (isValid) {
        let events: Event[] = JSON.parse(await readCache("events"));
        if (events !== undefined && events.length > 0) {
          const eventsByTitle: Event[] = events.filter(
            (event) => (event.organizer.id === organizerId),
          );
          return eventsByTitle;
        }
      }
  }
}
