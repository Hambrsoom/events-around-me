import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { Address } from '../entities/address.entity';
import { Organization, OrganizationInput } from '../entities/organization.entity'

@Resolver((of) => Organization)
export class OrganizationResolver {

  @Query(() => [Organization])
  // @UseMiddleware(checkJwt)
  async getOrganizations(): Promise<Organization[]> {
    return await Organization.find({
      relations: ["address", "events"]  
    });
  }

  @Query(() => Organization)
  // @UseMiddleware(checkJwt)
  async getOrganizationByID(
    @Arg('id') id : number
  ): Promise<Organization> {
    try {
      const organization: Organization = await Organization.findOneOrFail({
        where: {id},
        relations: ["address", "events"]  
      });
      return organization;
    } catch(err){
      throw new Error(`Didn't find the organization with the ID `)
    }
  }


  @Mutation(() => Organization)  
  async addOrganization(
    @Arg('Organization') { name, url, addressInput }: OrganizationInput
  ): Promise<Organization> {
    let organization = new Organization();
    organization.name = name;
    organization.url = url;
    organization.address = addressInput;

    try {
      return await Organization.save(organization)
    } catch(err) {
      throw new Error("Organization already exists")
    }
  }

  @Mutation(()=> Organization)
  async editOrganization(
    @Arg('Organization') { id, name, url, addressInput }: OrganizationInput
  ): Promise<Organization> {
    let organization: Organization = new Organization();

    try {
        organization = await Organization.findOne({
          where: {id},
          relations: ["address"]  
        })        
    } catch(err){
      throw new Error("Couldn't find the organization");
    }

    if (name) {
      organization.name = name;
    } 
    if (url) {
      organization.url = url;
    }
  
    let address;
    if (addressInput && !organization.address.equal(addressInput)){
      address = addressInput;
    }
    
    try {
      console.log(organization);
      const newOrganization: Organization = await Organization.save(organization);

      Address.save(address);
      return newOrganization;
    } catch(err) {
      throw new Error("Couldn't update organization")
    }
  }
}