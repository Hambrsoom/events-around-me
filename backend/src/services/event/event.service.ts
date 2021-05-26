import { getCustomRepository, getRepository, MoreThan } from "typeorm";
import { Event } from "../../entities/event.entity";
import { Organization } from "../../entities/organization.entity";
import OwnershipError from "../../error-handlers/ownership.error-handler";
import { EventRepository } from "../../repositories/event.repository";
import CoordinatesInput  from "../../types/coordinates-input.type";
import PaginatedResponseClass from "../../types/pagination/pagination-response.type";
import getDistanceFromCoordinatesInKm from "../../utilities/distance-calculator";
import { OrganizationService } from "../organization.service";
import { PaginationService } from "../pagination.service";
import { EventCachingService } from "./event-caching.service";

export class EventService {

  public static async getAllEvents(
    ): Promise<Event[]> {
      let events: Event[] = await EventCachingService.getCachedEvents();

      if (events && events.length) {
          return events;
      } else {
        const eventRepository = getCustomRepository(EventRepository);
        events = await eventRepository.findUpcomingEvents();

        EventCachingService.cachingEvents(events);
        return events;
      }
  }

  public static async getAllEventsCursor (after: string, first: number): Promise<PaginatedResponseClass> {
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
    organizationId: string,
    ): Promise <Event[]> {
      let events: Event[] = await EventCachingService.getEventsForOrganizationFromCache(organizationId);

      if (events !== undefined && events.length > 0) {
          return events;
      } else {
        const eventRepository = getCustomRepository(EventRepository);
        events = await eventRepository.findEventsForOragnization(organizationId);

        return events;
      }
  }

  public static async getEventById(
    eventId: string,
    ): Promise <Event> {
      let event: Event = await EventCachingService.getEventByIdFromCache(eventId);

      if (event) {
        return event;
      } else {
        const eventRepository = getCustomRepository(EventRepository);
        event = await eventRepository.findEventById(eventId);
        return event;
      }
  }

  public static async saveEvent(
    {title, url, date, address, description}: any,
    organizerId: string,
    ): Promise<Event> {
      const organizer: Organization = await OrganizationService.getOrganizationById(organizerId);

      const eventRepository = getCustomRepository(EventRepository);
      const newEvent: Event = await eventRepository.saveEvent(
        {title, url, date, address, description},
        organizer,
      );
      return newEvent;
  }

  public static async editEventById(
    {title, url, date, address, description}: any,
    eventId: string,
    ): Promise<Event> {
      let event: Event = await EventService.getEventById(eventId);
      event.title = title || event.title;
      event.url = url || event.url;
      event.date = date || event.date;
      event.description = description || event.description;

      if (address && !event.address.equal(address)) {
          event.address = address;
          event.address.id = event.address.id;
      }
      const eventRepository = getCustomRepository(EventRepository);
      const newEvent: Event = await eventRepository.editEvent(event);
      return newEvent;
  }

  public static async getUserEvents(
    userId: string,
    ): Promise<Event[]> {
      const eventRepository = getCustomRepository(EventRepository);
      return await eventRepository.findUserEvents(userId);
  }

  public static async isEventOwner(
    userId: string,
    eventId: string,
    ): Promise<boolean> {
      const eventRepository = getCustomRepository(EventRepository);
      const eventExists: boolean = await eventRepository.isEventOwner(
        userId,
        eventId,
      );

      if (!eventExists) {
        throw new OwnershipError(eventId, "event");
      }
      return true;
  }
}
