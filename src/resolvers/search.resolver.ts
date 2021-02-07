import { Query, Resolver, Arg, Authorized } from 'type-graphql'
import { Event } from '../entities/event.entity';

@Resolver()
export class SearchResolver {

  @Query(() => [Event])
  @Authorized()
  async searchForEvents(
    @Arg('text') text : string
    ): Promise<Event[]> {

    return await Event.createQueryBuilder()
      .select()
      .where("(title LIKE :text)", 
      {text: `%${text}%`})
      .getMany();
  }
}
