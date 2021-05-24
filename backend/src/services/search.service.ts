import { getRepository } from "typeorm";
import { Event } from "../entities/event.entity";
import { EventCashingService } from "./event/event-caching.service";

export class SearchService {
  public static async getEventsByTitle(
    text: string,
    ): Promise <Event[]> {
      const events: Event[] = await EventCashingService.getEventsByTitle(text);

      if (events !== undefined && events.length > 0) {
          return events;
      } else {
          return await getRepository(Event).createQueryBuilder("event")
          .select()
          .leftJoinAndSelect("event.address", "address")
          .leftJoinAndSelect("event.images", "images")
          .where("(title LIKE :title AND date > :date)",
          {title: `%${text}%`, date: new Date()})
          .getMany();
      }
  }
}
