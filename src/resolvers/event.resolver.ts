import { Query, Resolver, Mutation, Arg, UseMiddleware, Authorized } from "type-graphql"
import { Event, EventInput } from "../entities/event.entity";
import { Role } from "../entities/user.entity";
import { isEventOwner } from "../middlewares/isOwner";

import { EventService } from "../services/event.service";
import { OrganizationService } from "../services/organization.service";

@Resolver(() => Event)
export class EventResolver {

  @Query(() => [Event])
  @Authorized()
  async getAllEvents()
    : Promise<Event[]> {
    return await EventService.getAllEvents();
  }

  @Query(() => [Event])
  @Authorized()
  async getAllEventsForOrganization(
    @Arg("organizationId") OrganizationId: number
    ): Promise<Event[]> {

    return await Event.find({
        where: { organizer: OrganizationId },
        relations: ["address", "images"]
    });
  }


  @Query(() => Event)
  @Authorized()
  async getEventById(
    @Arg("id") id : number
    ): Promise<Event> {

    return await EventService.getEventById(id);
  }


  @Mutation(() => Event)
  @Authorized([Role.organizer])
  async addEvent(
    @Arg("event") { title, url, date, address, organizerId }: EventInput
    ): Promise<Event> {

    let event = new Event();
    event.title = title;
    event.url = url;
    event.address = address;
    event.date = date;
    event.organizer = await OrganizationService.getOrganizationById(organizerId);
      console.log(event.organizer);
    return EventService.saveEvent(event);
  }

  @Mutation(()=> Event)
  @Authorized([Role.organizer])
  @UseMiddleware(isEventOwner)
  async editEvent(
    @Arg("event") { id,  title, url, date, address, organizerId }: EventInput
    ): Promise<Event> {

    let event: Event = await EventService.getEventById(id);
    if (title != null) { event.title = title; }
    if (url != null) { event.url = url; }
    if (date != null) { event.date = date; }

    if(organizerId !=null) {
      event.organizer = await OrganizationService.getOrganizationById(organizerId);
    }
  
    if (address && !event.address.equal(address)) {
        event.address = address;
    }
    return EventService.saveEvent(event);
  }
}