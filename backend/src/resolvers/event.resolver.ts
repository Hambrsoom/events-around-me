import { Arg, Authorized, Ctx, ID, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { Context } from "vm";
import { Event } from "../entities/event.entity";
import { Role } from "../entities/user/user-role.enum";
import { User } from "../entities/user/user.entity";
import { isEventOwner } from "../middlewares/is-owner";
import { EventService } from "../services/event/event.service";
import { UserService } from "../services/user/user.service";
import  CoordinatesInput  from "../types/coordinates-input.type";
import { EventInput } from "../types/event-input.type";
import { CursorInput } from "../types/pagination/cursor-input.type";
import PaginatedResponseClass from "../types/pagination/pagination-response.type";

// @ObjectType()
// export class PaginatedEventResponse extends PaginatedResponse(Event) {
// }

@Resolver(() => Event)
export class EventResolver {

  @Query(() => PaginatedResponseClass)
  @Authorized()
  public async getEvents(
    @Arg("cursor") {after, first }: CursorInput,
  ): Promise<PaginatedResponseClass> {
    return await EventService.getAllEventsCursor(after, first);
  }

  @Query(() => [Event])
  @Authorized()
  public async getEventsAtDistnace(
    @Arg("desiredDistanceInKm") desiredDistanceInKm: number,
    @Arg("userCoordinates") userCoordinates: CoordinatesInput,
  ): Promise<Event[]> {
    return await EventService.getEventsAtDistnace(userCoordinates, desiredDistanceInKm);
  }

  @Query(() => [Event])
  @Authorized()
  public async getAllEventsForOrganization(
    @Arg("organizationId", () => ID) OrganizationId: string,
    ): Promise<Event[]> {
      return EventService.getAllEventsForOrganization(OrganizationId);
  }

  @Query(() => [Event])
  @Authorized()
  public async getEventsAtDistance(
    @Arg("distance") distance: number,
  ): Promise<Event[]> {
    return null;
  }

  @Query(() => Event)
  @Authorized()
  public async getEventById(
    @Arg("id", () => ID) id: string,
    ): Promise<Event> {
      return await EventService.getEventById(id);
  }

  @Mutation(() => Event)
  @Authorized([Role.organizer])
  public async addEvent(
    @Arg("event") { title, url, date, address, description }: EventInput,
    @Ctx() ctx: Context,
    ): Promise<Event> {
      const user: User = await UserService.getUserByID(ctx.userId);
      return await EventService.saveEvent(
        {title, url, date, address, description},
        user.organization.id);
  }

  @Mutation(() => Event)
  @Authorized([Role.organizer])
  @UseMiddleware(isEventOwner)
  public async editEvent(
    @Arg("eventId", () => ID) eventId: string,
    @Arg("event") { title, url, date, address, description }: EventInput,
    ): Promise<Event> {
      return await EventService.editEventById(
        {title, url, date, address, description},
        eventId);
  }
}

