import { Query, Resolver, Mutation, Arg, UseMiddleware, ID, Authorized, Ctx } from "type-graphql";
import { Context } from "vm";
import { Event, EventInput } from "../entities/event.entity";
import { Role } from "../entities/user/user-role.enum";
import { User } from "../entities/user/user.entity";
import { isEventOwner } from "../middlewares/isOwner";
import { EventService } from "../services/event/event.service";
import { UserService } from "../services/user/user.service";
import { ICoordinates } from "../types/coordinates";
import { CursorInput, EventsCursorResult } from "../types/pagination";

@Resolver(() => Event)
export class EventResolver {

  @Query(() => [Event])
  @Authorized()
  async getAllEvents(
  ): Promise<Event[]> {
    return await EventService.getAllEvents();
  }

  @Query(() => EventsCursorResult)
  // @Authorized()
  async getAllEventsCursor(
    @Arg("cursor") {after, first }: CursorInput
  ): Promise<EventsCursorResult> {
    return await EventService.getAllEventsCursor(after, first);
    // return await EventService.getAllEvents();
  }


  @Query(() => [Event])
  @Authorized()
  async getEventsAtDistnace(
    @Arg("desiredDistanceInKm") desiredDistanceInKm: number,
    @Arg("userCoordinates") userCoordinates: ICoordinates
  ): Promise<Event[]> {
    return await EventService.getEventsAtDistnace(userCoordinates, desiredDistanceInKm);
  }

  @Query(() => [Event])
  @Authorized()
  async getAllEventsForOrganization(
    @Arg("organizationId", () => ID) OrganizationId: string
    ): Promise<Event[]> {
      return EventService.getAllEventsForOrganization(OrganizationId);
  }

  @Query(() => [Event])
  @Authorized()
  async getEventsAtDistance(
    @Arg("distance") distance: number
  ): Promise<Event[]> {
    return null;
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
      const user: User = await UserService.getUserByID(ctx.userId);
      return await EventService.saveEvent(
        {title, url, date, address, description},
        user.organization.id);
  }

  @Mutation(()=> Event)
  @Authorized([Role.organizer])
  @UseMiddleware(isEventOwner)
  async editEvent(
    @Arg("eventId",() => ID) eventId: string,
    @Arg("event") { title, url, date, address, description }: EventInput
    ): Promise<Event> {
      return await EventService.editEventById(
        {title, url, date, address, description},
        eventId);
  }
}