import { EntityRepository, MoreThan, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Organization } from "../entities/organization.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import PersistenceError from "../error-handlers/persistence-error.error-handler";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  public async findEventsByText(
    text: string,
  ): Promise<Event[]> {
    return await this.createQueryBuilder("event")
      .select()
      .leftJoinAndSelect("event.address", "address")
      .leftJoinAndSelect("event.images", "images")
      .where("(title LIKE :title AND date > :date)",
      {title: `%${text}%`, date: new Date()})
      .getMany();
  }

  public async findUpcomingEvents(
  ): Promise<Event[]> {
    return await this.find({
      relations: ["address", "images", "organizer"],
      where: {date: MoreThan(new Date())},
    });
  }

  public async findEventsForOragnization(
    organizationId: string,
  ): Promise<Event[]> {
    return await this.find({
      relations: ["address", "images", "organizer"],
      where: {
        date: MoreThan(new Date()),
        organizer: organizationId,
      },
    });
  }

  public async findEventById(
    eventId: string,
  ): Promise<Event> {
    try {
      const event = await this.findOneOrFail({
        relations: ["address", "images", "organizer"],
        where: { id: eventId },
      });

      return event;
    } catch (err) {
      throw new NotFoundError(eventId, "event", err.message);
    }
  }

  public async saveEvent(
    {title, url, date, address, description}: any,
    organizer: Organization,
  ): Promise<Event> {
    try {
      const event = await this.create({
        title,
        url,
        address,
        date,
        description,
        organizer,
      });
      return await this.save(event);
    } catch (err) {
      throw new PersistenceError("event", err.message);
    }
  }

  public async editEvent(
    event: Event,
  ): Promise<Event> {
    try {
      return await this.save(event);
    } catch (err) {
      throw new PersistenceError("event", err.message);
    }
  }

  public async findUserEvents(
    userId: string,
    ): Promise<Event[]> {
      try {
        return await this.createQueryBuilder("event")
        .leftJoinAndSelect("event.organizer", "organization")
        .leftJoinAndSelect("organization.user", "user")
        .where("user.id=:userId", {userId})
        .getMany();
      } catch (err) {
          throw new NotFoundError(userId, "user", err.message);
      }
  }

  public async isEventBelongToUser(
    userId: string,
    eventId: string,
  ): Promise<boolean> {
    const event = await this.createQueryBuilder("event")
      .leftJoinAndSelect("event.organizer", "organization")
      .leftJoinAndSelect("organization.user", "user")
      .where("event.id=:eventId", {eventId})
      .andWhere("user.id=:userId", {userId})
      .getOne();
    return event ? true : false;
  }
}
