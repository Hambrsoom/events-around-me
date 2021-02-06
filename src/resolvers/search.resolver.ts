import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { Address } from '../entities/address.entity';
import { Event } from '../entities/event.entity';

@Resolver()
export class SearchResolver {

  @Query(() => [Event])
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
