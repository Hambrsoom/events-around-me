import { Query, Resolver, Arg, Authorized } from 'type-graphql'
import { Event } from '../entities/event.entity';
import { SearchService } from '../services/search.service';

@Resolver()
export class SearchResolver {

  @Query(() => [Event])
  @Authorized()
  async searchForEvents(
    @Arg('text') text : string
    ): Promise<Event[]> {

    return SearchService.getEventsByTitle(text);
  }
}
