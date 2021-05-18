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
      return OrganizationService.saveOrganization(
        {name, url, address});
  }

  @Mutation(()=> Organization)
  @Authorized([Role.admin])
  async editOrganization(
    @Arg("organizationId", ()=> ID) organizationId: string,
    @Arg("organization") { name, url, address }: OrganizationInput
    ): Promise<Organization> {
      return OrganizationService.editOrganizationById(
        {name, url, address},
        organizationId
      );
  }
}