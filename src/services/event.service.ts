import { Event } from "../entities/event.entity";
import { Organization } from "../entities/organization.entity";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";

export class EventService {
  public static async getAllEvents()
  : Promise<Event[]> {

    return await Event.find({
      relations:["address", "images"]       
    });
  }

  public static async getEventById(
    eventId: number
    ): Promise <Event> {
      
    try{
      return await Event.findOne({
        where: { id: eventId },
        relations:["address", "images"]
      })
    } catch(err){
      throw new Error(`Could not find the event with id ${eventId}`);
    }
  }

  public static async saveEvent(
    event: Event
    ): Promise<Event> {
        
    try {
      // To update the event and the address, it is important to pass the id of event and the address related to this event,
      // Otherwise, it will create a new row.
      return await Event.save(event);
    } catch(err) {
      throw new Error("Failed in saving the event");
    }
  }

  public static async getAllEventsOfUser(
    userId: number
    ): Promise<Event[]> {

    const user: User = await UserService.getUserByID(userId);
    try {
      const organization: Organization = await Organization.findOne(user.organization.id, {
            relations: ["events"]
      });
      return organization.events
    } catch(err){
      throw new Error(`Could not find an organization with id ${user.organization.id}`);
    }
  }
}