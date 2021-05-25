import { getCustomRepository } from "typeorm";
import { Organization } from "../../src/entities/organization.entity";
import { OrganizationRepository } from "../../src/repositories/organization.repository";
import { OrganizationMockedData } from "../mock-data/organizations";

export const insertOrganization =
  async() => {
    const organizationRepository = getCustomRepository(OrganizationRepository);

    const existingOrganization: Organization = await organizationRepository.findOne({ where: {
      name: "Moisson Montreal",
    }});

    if (existingOrganization === undefined) {
      const organization: Organization = await OrganizationMockedData.getOrganization1();
      return await organizationRepository.save(organization);
    } else {
      return existingOrganization;
    }
};
