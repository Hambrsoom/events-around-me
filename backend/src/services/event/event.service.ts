import { getRepository, MoreThan } from "typeorm";
import { Event } from "../../entities/event.entity";
import { Organization } from "../../entities/organization.entity";
import { Role } from "../../entities/user/user-role.enum";
import { User } from "../../entities/user/user.entity";
import NotFoundError from "../../error-handlers/not-found.error-handler";
import OwnershipError from "../../error-handlers/ownership.error-handler";
import PersistenceError  from "../../error-handlers/persistence-error.error-handler";
import { PaginatedEventResponse } from "../../resolvers/event.resolver";
import CoordinatesInput  from "../../types/coordinates-input.type";
import getDistanceFromCoordinatesInKm from "../../utilities/distance-calculator";
import { OrganizationService } from "../organization.service";
import { PaginationService } from "../pagination.service";
import { UserService } from "../user/user.service";
import { EventCashingService } from "./event-caching.service";

export class EventService {
  public static async getAllEvents(
    ): Promise<Event[]> {
      let events: Event[] = await EventCashingService.getEvents();

      if (events && events.length) {
          return events;
      } else {
        events = await getRepository(Event).find({
          relations: ["address", "images", "organizer"],
          where: {date: MoreThan(new Date())},
        });

        EventCashingService.setEvents(events);
        return events;
      }
  }

  public static async getAllEventsCursor (after: string, first: number): Promise<PaginatedEventResponse> {
    const eventsFromDatabase: Event[] = await EventService.getAllEvents();

    return PaginationService.getElements(after, first, eventsFromDatabase);
  };


  public static async getEventsAtDistnace(
    userCoordinates: CoordinatesInput,
    desiredDistanceInKm: number,
  ): Promise<Event[]> {
    const events: Event[] = await EventService.getAllEvents();

    const filteredEvents: Event[] = events.filter((event: Event) => getDistanceFromCoordinatesInKm(
      userCoordinates,
      {
        latitude: event.address.latitude,
        longitude: event.address.longitude,
      }) <=  desiredDistanceInKm);
    return filteredEvents;
  }

  public static async getAllEventsForOrganization(
    OrganizationId: string,
    ): Promise <Event[]> {
      let events: Event[] = await EventCashingService.getAllEventsForOrganization(OrganizationId);

      if (events !== undefined && events.length > 0) {
          return events;
      } else {
        events = await getRepository(Event).find({
          where: {
            organizer: OrganizationId,
            date: MoreThan(new Date()),
          },
          relations: ["address", "images", "organizer"],
        });

        return events;
      }
  }

  public static async getEventById(
    eventId: string,
    ): Promise <Event> {
      let event: Event = await EventCashingService.getEventById(eventId);

      if (event) {
        return event;
      } else {
        try {
          event = await getRepository(Event).findOneOrFail({
            where: { id: eventId },
            relations: ["address", "images", "organizer"],
          });
          EventCashingService.setNotUpToDate();

          return event;
        } catch (err) {
          throw new NotFoundError(eventId, "event");
        }
      }
  }

  public static async saveEvent(
    {title, url, date, address, description}: any,
    organizerId: string,
    ): Promise<Event> {
      const organizer: Organization = await OrganizationService.getOrganizationById(organizerId);

      try {
        const event: Event = await getRepository(Event).create({
          title,
          url,
          address,
          date,
          description,
          organizer,
        });

        const newEvent: Event = await getRepository(Event).save(event);
        EventCashingService.setNotUpToDate();

        return newEvent;
      } catch (err) {
        throw new PersistenceError("event", err.message);
      }
  }

  public static async editEventById(
    {title, url, date, address, description}: any,
    eventId: string,
    ) {
      try {
        let event: Event = await EventService.getEventById(eventId);
        event.title = title || event.title;
        event.url = url || event.url;
        event.date = date || event.date;
        event.description = description || event.description;

        if (address && !event.address.equal(address)) {
            event.address = address;
            event.address.id = event.address.id;
        }

        const newEvent: any = await getRepository(Event).save(event);
        EventCashingService.setNotUpToDate();

        return newEvent;
    } catch (err) {
      throw new PersistenceError("event");
    }
  }

  public static async getAllEventsOfUser(
    userId: string,
    ): Promise<Event[]> {
      const user: User = await UserService.getUserByID(userId);
      try {
        const organization: Organization = await Organization.findOne(user.organization.id, {
              relations: ["events"],
        });
        return organization.events;
      } catch (err) {
        throw new NotFoundError(user.organization.id, "organization");
      }
  }

  public static async isEventOwner(
    userId: string,
    eventId: string,
    ): Promise<boolean> {
      const event = await getRepository(Event).createQueryBuilder("event")
        .leftJoinAndSelect("event.organizer", "organization")
        .leftJoinAndSelect("organization.user", "user")
        .where("event.id=:eventId", {eventId})
        .andWhere("user.id=:userId", {userId})
        .getOne();

      if (event === undefined) {
        throw new OwnershipError(eventId, "event");
      }
      return true;
  }
}
