import { Query, Resolver, Mutation, Arg, ID, Authorized } from "type-graphql";

import { Organization, OrganizationInput } from "../entities/organization.entity";
import { Role } from "../entities/user/user-role.enum";
import { OrganizationService } from "../services/organization.service";

@Resolver(() => Organization)
export class OrganizationResolver {

  @Query(() => [Organization])
  @Authorized()
  async getOrganizations(
    ): Promise<Organization[]> {
      return await OrganizationService.getOrganizations();
  }

  @Query(() => Organization)
  @Authorized()
  async getOrganizationById(
    @Arg("id", ()=> ID) id : string
    ): Promise<Organization> {
      return OrganizationService.getOrganizationById(id);
  }

  @Mutation(() => Organization)
  @Authorized([Role.admin])
  async addOrganization(
    @Arg("organization") { name, url, address }: OrganizationInput
    ): Promise<Organization> {
      let organization: Organization = new Organization();
      organization.name = name;
      organization.url = url;
      organization.address = address;

      return OrganizationService.saveOrganization(organization);
  }

  @Mutation(()=> Organization)
  @Authorized([Role.admin])
  async editOrganization(
    @Arg("organizationId", ()=> ID) organizationId: string,
    @Arg("organization") { name, url, address }: OrganizationInput
    ): Promise<Organization> {
      let organization: Organization = await OrganizationService.getOrganizationById(organizationId);
      const addressId: string = organization.address.id;

      if (name) { organization.name = name; }
      if (url) { organization.url = url; }

      if (address && !organization.address.equal(address)) {
        organization.address = address;
        organization.address.id = addressId;
      }

      return OrganizationService.saveOrganization(organization);
  }
}