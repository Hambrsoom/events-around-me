import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Organization } from "../entities/organization.entity";
import { Role } from "../entities/user/user-role.enum";
import { OrganizationService } from "../services/organization.service";
import { OrganizationInput } from "../types/organization-input.type";

@Resolver(() => Organization)
export class OrganizationResolver {

  @Query(() => [Organization])
  @Authorized()
  public async getOrganizations(
    ): Promise<Organization[]> {
      return await OrganizationService.getOrganizations();
  }

  @Query(() => Organization)
  @Authorized()
  public async getOrganizationById(
    @Arg("id", () => ID) id: string,
    ): Promise<Organization> {
      return OrganizationService.getOrganizationById(id);
  }

  @Mutation(() => Organization)
  @Authorized([Role.admin])
  public async addOrganization(
    @Arg("organization") { name, url, address }: OrganizationInput,
    ): Promise<Organization> {
      return OrganizationService.saveOrganization(
        {name, url, address});
  }

  @Mutation(() => Organization)
  @Authorized([Role.admin])
  public async editOrganization(
    @Arg("organizationId", () => ID) organizationId: string,
    @Arg("organization") { name, url, address }: OrganizationInput,
    ): Promise<Organization> {
      return OrganizationService.editOrganizationById(
        {name, url, address},
        organizationId,
      );
  }
}
