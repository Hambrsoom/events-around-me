import { Query, Resolver, Mutation, Arg, UseMiddleware, ID, Authorized, Ctx } from "type-graphql";
import { Context } from "vm";
import { Event, EventInput } from "../entities/event.entity";
import { Role } from "../entities/user/user-role.enum";
import { User } from "../entities/user/user.entity";
import { isEventOwner } from "../middlewares/isOwner";

import { EventService } from "../services/event/event.service";
import { OrganizationService } from "../services/organization.service";
import { UserService } from "../services/user/user.service";

@Resolver(() => Event)
export class EventResolver {

  @Query(() => [Event])
  @Authorized()
  async getAllEvents(
  ): Promise<Event[]> {
    return await EventService.getAllEvents();
  }

  @Query(() => [Event])
  @Authorized()
  async getAllEventsForOrganization(
    @Arg("organizationId", () => ID) OrganizationId: string
    ): Promise<Event[]> {
      return EventService.getAllEventsForOrganization(OrganizationId);
  }


  @Query(() => Event)
  @Authorized()
  async getEventById(
    @Arg("id", () => ID) id : string
    ): Promise<Event> {
      return await EventService.getEventById(id);
  }


  @Mutation(() => Event)
  @Authorized([Role.organizer])
  async addEvent(
    @Arg("event") { title, url, date, address, description }: EventInput,
    @Ctx() ctx: Context
    ): Promise<Event> {

      console.log("BTEEEEEEEEEEEEEEEEEEEEEEEEE");
      const user: User = await UserService.getUserByID(ctx.userId);
      let event: Event = new Event();
      event.title = title;
      event.url = url;
      event.address = address;
      event.date = date;
      event.description = description;
      event.organizer = await OrganizationService.getOrganizationById(user.organization.id);
      return await EventService.saveEvent(event);
  }

  @Mutation(()=> Event)
  @Authorized([Role.organizer])
  @UseMiddleware(isEventOwner)
  async editEvent(
    @Arg("eventId",() => ID) eventId: string,
    @Arg("event") { title, url, date, address }: EventInput
    ): Promise<Event> {
      let event: Event = await EventService.getEventById(eventId);
      const addressId: string = event.address.id;
      if (title != null) { event.title = title; }
      if (url != null) { event.url = url; }
      if (date != null) { event.date = date; }

      if (address && !event.address.equal(address)) {
          event.address = address;
          event.address.id = addressId;
      }

      return EventService.saveEvent(event);
  }
}