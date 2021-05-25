import { getCustomRepository } from "typeorm";
import { Organization } from "../entities/organization.entity";
import { OrganizationRepository } from "../repositories/organization.repository";
import { OrganizationInput } from "../types/organization-input.type";

export class OrganizationService {
  public static async getOrganizationById(
    organizationId: string,
    ): Promise <Organization> {
      const organizationRepository = getCustomRepository(OrganizationRepository);
      return await organizationRepository.findOrganizationById(organizationId);
  }

  public static async getOrganizations(
      ): Promise<Organization[]> {
        const organizationRepository = getCustomRepository(OrganizationRepository);
        return await organizationRepository.findOrganizations();
  }

  public static async saveOrganization(
      { name, url, address }: OrganizationInput,
      ): Promise<Organization> {
        const organizationRepository = getCustomRepository(OrganizationRepository);
        return await organizationRepository.saveOrganization({ name, url, address });
  }

  public static async editOrganizationById(
      { name, url, address }: OrganizationInput,
      organizationId: string,
    ): Promise<Organization> {
      let organization: Organization = await OrganizationService.getOrganizationById(organizationId);

      organization.name = name || organization.name;
      organization.url = url || organization.url;

      if (address && !organization.address.equal(address)) {
          organization.address = address;
          organization.address.id = organization.address.id;
      }
      const organizationRepository = getCustomRepository(OrganizationRepository);
      return await organizationRepository.editOrganization(organization);
  }
}
