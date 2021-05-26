import { getCustomRepository, getRepository } from "typeorm";
import { Event } from "../entities/event.entity";
import { EventRepository } from "../repositories/event.repository";
import { EventCachingService } from "./event/event-caching.service";

export class SearchService {
  public static async getEventsByTitle(
    text: string,
    ): Promise <Event[]> {
      const events: Event[] = await EventCachingService.getEventsByTitleFromCache(text);

      if (events !== undefined && events.length > 0) {
          return events;
      } else {
        const eventRepository = getCustomRepository(EventRepository);
        return await eventRepository.findEventsByText(text);
      }
  }
}
