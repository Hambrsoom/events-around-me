import { Event } from "../../entities/event.entity";
import { Organization } from "../../entities/organization.entity";
import { User } from "../../entities/user/user.entity";
import { EventCashingService } from "./event-caching.service";
import { UserService } from "../user/user.service";
import { MoreThan } from "typeorm";
import { Role } from "../../entities/user/user-role.enum";
import { OrganizationService } from "../organization.service";
import { ErrorMessage } from "../../utilities/error-message";

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
    OrganizationId: string
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
    eventId: string
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
          console.log(event);
          EventCashingService.setNotUpToDate();

          return event;
        } catch(err) {
          ErrorMessage.notFoundErrorMessage(eventId, "event");
        }
      }
  }

  public static async saveEvent(
    event: Event
    ): Promise<Event> {
      try {
        const newEvent: Event = await Event.save(event);
        EventCashingService.setNotUpToDate();

        return newEvent;
      } catch(err) {
        ErrorMessage.failedToStoreErrorMessage("event");
      }
  }

  public static async getAllEventsOfUser(
    userId: string
    ): Promise<Event[]> {
      const user: User = await UserService.getUserByID(userId);
      try {
        const organization: Organization = await Organization.findOne(user.organization.id, {
              relations: ["events"]
        });
        return organization.events;
      } catch(err) {
        ErrorMessage.notFoundErrorMessage(user.organization.id, "organization");
      }
  }

  public static async isEventOwner(
    userId: string,
    eventId: string
    ): Promise<boolean> {
      const user: User = await UserService.getUserByID(userId);

      if(user.role === Role.organizer) {
          const organization: Organization = await OrganizationService.getOrganizationById(user.organization.id);

          const event: Event = organization.events.find(event => event.id === eventId);

          if(event === undefined) {
            ErrorMessage.forbiddenErrorForOwnership(eventId, "event");
          }

          return true;
      }
  }
}