import { Query, Resolver, Mutation, Arg, Authorized } from 'type-graphql'
import { Organization, OrganizationInput } from '../entities/organization.entity'
import { Role } from '../entities/user.entity';
import { OrganizationService } from '../services/organization.service';

@Resolver(() => Organization)
export class OrganizationResolver {

  @Query(() => [Organization])
  @Authorized()
  async getOrganizations()
    : Promise<Organization[]> {
    return await Organization.find({
      relations: ["address", "events"]  
    });
  }

  @Query(() => Organization)
  @Authorized()
  async getOrganizationByID(
    @Arg('id') id : number
  ): Promise<Organization> {
    return OrganizationService.getOrganizationById(id);
  }

  @Mutation(() => Organization)
  @Authorized([Role.admin])  
  async addOrganization(
    @Arg('Organization') { name, url, addressInput }: OrganizationInput
    ): Promise<Organization> {

    let organization = new Organization();
    organization.name = name;
    organization.url = url;
    organization.address = addressInput;

    return OrganizationService.saveOrganization(organization);
  }

  @Mutation(()=> Organization)
  @Authorized([Role.admin])  
  async editOrganization(
    @Arg('organization') { id, name, url, addressInput }: OrganizationInput
    ): Promise<Organization> {
    let organization: Organization = await OrganizationService.getOrganizationById(id);

    if (name) { organization.name = name; } 
    if (url) { organization.url = url; }
  
    if (addressInput && !organization.address.equal(addressInput)){
      organization.address = addressInput;
    }
    
    return OrganizationService.saveOrganization(organization);
  }
}