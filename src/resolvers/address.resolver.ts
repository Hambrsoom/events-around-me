import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { AdvancedConsoleLogger } from 'typeorm';
import { Address, AddressInput } from '../entities/address.entity';
import { Organization, OrganizationInput } from '../entities/organization.entity'
import { checkJwt } from '../middlewares/checkJwt'

@Resolver((of) => Address)
export class AddressResolver {

  @Query(()=> Address)
  async getAddrese(): Promise<Address> {
    let address: Address = new Address();
    const addresses = await Address.find();
       console.log(addresses);

    return null;
   
  }
}