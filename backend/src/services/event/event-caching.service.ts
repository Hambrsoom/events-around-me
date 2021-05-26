import { Event } from "../../entities/event.entity";
import { cache, del, readCache } from "../../redis-connection";

const cacheValidtiy = "valid";
const cachedEvents = "events";

export class EventCachingService {
  public static async getCachedEvents(
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isCacheValid();
      if (isValid) {
        let events: any = await readCache(cachedEvents);
        return events ? JSON.parse(events) : null;
      }
  }

  public static async cachingEvents(
    events: Event[],
    ): Promise<void> {
      await cache(cachedEvents, JSON.stringify(events));
      await cache(cacheValidtiy, true);
  }

  public static async setCacheNotValid(
    ): Promise<void> {
      await cache(cacheValidtiy, false);
      await del(cachedEvents);
  }

  public static async isCacheValid(
    ): Promise<boolean> {
      return await readCache(cacheValidtiy) === true;
  }

  public static async getEventByIdFromCache(
    eventId: string,
    ): Promise<Event> {
      const isValid: boolean = await EventCachingService.isCacheValid();
      if (isValid) {
        let events: Event[] = JSON.parse(await readCache(cachedEvents));
        if (events !== undefined) {
          return events.find((event) => event.id === eventId);
        }
      }
  }

  public static async getEventsByTitleFromCache(
    text: string,
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isCacheValid();

      if (isValid) {
        let events: Event[] = JSON.parse(await readCache(cachedEvents));
        if (events !== undefined && events.length > 0) {
          const eventsByTitle: Event[] = events.filter(
            (event) => (event.title.toLowerCase()).includes(text.toLowerCase()),
          );
          return eventsByTitle;
        }
      }
  }

  public static async getEventsForOrganizationFromCache(
    organizerId: string,
    ): Promise<Event[]> {
      const isValid: boolean = await EventCachingService.isCacheValid();

      if (isValid) {
        let events: Event[] = JSON.parse(await readCache(cachedEvents));
        if (events !== undefined && events.length > 0) {
          const eventsByTitle: Event[] = events.filter(
            (event) => (event.organizer.id === organizerId),
          );
          return eventsByTitle;
        }
      }
  }
}
