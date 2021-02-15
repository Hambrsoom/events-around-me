import { Event } from "../../entities/event.entity";
import { Organization } from "../../entities/organization.entity";
import { User } from "../../entities/user/user.entity";
import { EventCashingService } from "./event-caching.service";
import { UserService } from "../user/user.service";
import { MoreThan } from "typeorm";

export class EventService {
  public static async getAllEvents(
    ): Promise<Event[]> {
      let events: Event[] = await EventCashingService.getEvents();

      if(events !== undefined && events.length > 0) {
          return events;
      } else {
        events = await Event.find({
          where: {date: MoreThan(new Date())},
          relations:["address", "images", "organizer"]
        });

        EventCashingService.setEvents(events);
        return events;
      }
  }

  public static async getAllEventsForOrganization(
    OrganizationId: number
    ): Promise <Event[]> {
      let events: Event[] = await EventCashingService.getAllEventsForOrganization(OrganizationId);

      if(events !== undefined && events.length > 0) {
          return events;
      } else {
        events = await Event.find({
          where: {
            organizer: OrganizationId,
            date: MoreThan(new Date())
          },
          relations: ["address", "images", "organizer"]
        });

        return events;
      }
  }

  public static async getEventById(
    eventId: number
    ): Promise <Event> {
      let event: Event = await EventCashingService.getEventById(eventId);

      if(event !== undefined) {
        return event;
      } else {
        try {
          event = await Event.findOneOrFail({
            where: { id: eventId },
            relations:["address", "images", "organizer"]
          });

          // the cache is not up to date, thus we need to empty the cache. 
          // it will be populated again when the user request to get all the events.
          EventCashingService.setNotUpToDate();

          return event;
        } catch(err) {
          throw new Error(`Could not find the event with id ${eventId}`);
        }
      }
  }

  public static async saveEvent(
    event: Event
    ): Promise<Event> {
      try {
        // to update the event and the address,
        // it is important to pass the id of event and the address related to this event,
        // otherwise, it will create a new row.
        const newEvent: Event = await Event.save(event);

        // the cache is not up to date anymore,
        // thus we need to empty the cache.
        // it will be populated again when the user request to get all the events.
        EventCashingService.setNotUpToDate();

        return newEvent;
      } catch(err) {
        console.log(err);
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
        return organization.events;
      } catch(err) {
        throw new Error(`Could not find an organization with id ${user.organization.id}`);
      }
  }
}