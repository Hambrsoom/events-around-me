import { Event } from "../../entities/event.entity";
import { Organization } from "../../entities/organization.entity";
import { User } from "../../entities/user/user.entity";
import { EventCashingService } from "./event-caching.service";
import { UserService } from "../user/user.service";
import { MoreThan } from "typeorm";
import { Role } from "../../entities/user/user-role.enum";
import { OrganizationService } from "../organization.service";
import { MapService } from "../map/map.service";
import { ICoordinates } from "../../types/coordinates";
import { NotFoundError } from "../../error-handlers/not-found.error-handler";
import { StoringError } from "../../error-handlers/storing.error-handler";
import { ForbiddenForOwnershipError } from "../../error-handlers/ownership.error-handler";
import { Edge, EventsCursorResult } from "../../types/pagination";
import { UserInputError } from "../../error-handlers/input.error-handler";
import { PageInfo } from "../../types/pagination";

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

  public static async getAllEventsCursor (after: string, first: number): Promise<EventsCursorResult> {
    if (first < 0) {
      throw new UserInputError("First must be positive");
    }

    const eventsFromDatabase: Event[] = await EventService.getAllEvents();

    const totalCount: number = eventsFromDatabase.length;
    let events: Event[] = [];
    let start: number = 0;

    if (after !== undefined) {
      const index: number = eventsFromDatabase.findIndex((event) => event.id == after);
      if (index === -1) {
        throw new UserInputError("After does not exist");
      }
      start = index + 1;
    }
    events = first === undefined ?
      eventsFromDatabase :
      eventsFromDatabase.slice(start, start + first);
    let endCursor: string;

    const edges: Edge[] = events.map((event) => {
      endCursor = event.id;
      return ({
        cursor: endCursor,
        node: event
      });
    });
    const hasNextPage: boolean = start + first < totalCount;
    const pageInfo: PageInfo = endCursor !== undefined ?
      {
        endCursor,
        hasNextPage,
      } :
      {
        hasNextPage,
      };

    const result: EventsCursorResult = {
      edges,
      pageInfo,
      totalCount,
    };
    return result;
  };


  public static async getEventsAtDistnace(
    userCoordinates: ICoordinates,
    desiredDistanceInKm: number
  ): Promise<Event[]> {
    const events: Event[] = await EventService.getAllEvents();
    return await MapService.getTheClosestEventsToTheUser(
      userCoordinates.convertCoordintatesToString(),
      events,
      desiredDistanceInKm
    );
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
          EventCashingService.setNotUpToDate();

          return event;
        } catch(err) {
          throw new NotFoundError(eventId, "event");
        }
      }
  }

  public static async saveEvent(
    {title, url, date, address, description}: any,
    organizerId: string
    ): Promise<Event> {
      const organizer: Organization = await OrganizationService.getOrganizationById(organizerId);
      
      try {
        const event:Event = await Event.create({
          title,
          url,
          address,
          date,
          description,
          organizer
        });

        const newEvent: Event = await Event.save(event);
        EventCashingService.setNotUpToDate();

        return newEvent;
      } catch(err) {
        throw new StoringError("event");
      }
  }

  public static async editEventById(
    {title, url, date, address, description}: any,
    eventId: string
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

        const newEvent: Event = await Event.save(event);
        EventCashingService.setNotUpToDate();

        return newEvent;
    } catch(err) {
      throw new StoringError("event");
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
        throw new NotFoundError(user.organization.id, "organization");
      }
  }

  public static async isEventOwner(
    userId: string,
    eventId: string
    ): Promise<boolean> {
      const user: User = await UserService.getUserByID(userId);

      if(user.role === Role.organizer) {
          const organization: Organization = await OrganizationService.getOrganizationById(user.organization.id);

          const event: Event = organization.events.find(event => event.id == eventId);

          if(event === undefined) {
            throw new ForbiddenForOwnershipError(eventId, "event");
          }

          return true;
      }
  }
}