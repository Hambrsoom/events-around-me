import { Event } from "../entities/event.entity";
import { CashingService } from "./caching.service";

export class SearchService {
    public static async getEventsByTitle(
        text: string
        ): Promise <Event[]> {
            const events: Event[] = await CashingService.getEventsByTitle(text);
            if(events !== undefined && events.length > 0) {
                return events;
            } else {
                return await Event.createQueryBuilder()
                .select()
                .where("(title LIKE :title)",
                {title: `%${text}%`})
                .getMany();
            }
    }
}