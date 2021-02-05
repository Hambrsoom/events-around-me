import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { Address } from '../entities/address.entity';
import { Event, EventInput } from '../entities/event.entity';
import { Organization, OrganizationInput } from '../entities/organization.entity'

@Resolver()
export class SearchResolver {

  @Query(() => [Event])
  // @UseMiddleware(checkJwt)
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
