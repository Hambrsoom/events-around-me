import { Event } from "../entities/event.entity";

export class EventService {
    public static async getAllEvents(): Promise<Event[]>{
        return await Event.find();
    }

    public static async getEventById(eventId: number): Promise <Event> {
      try{
        return await Event.findOne({
          where: { id: eventId }
        })
      } catch(err){
        throw new Error(`Couldn't find the Event with ID ${eventId}`);
      }
    }
}