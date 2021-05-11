import { Organization } from "../../src/entities/organization.entity";
import { OrganizationMockedData } from "../mock-data/organizations";

export const insertOrganization = 
    async() => {
        const existingOrganization: Organization = await Organization.findOne({ where: {
            name: "Moisson Montreal"
        }});

        if(existingOrganization === undefined) {
            const organization: Organization = await OrganizationMockedData.getOrganization1();
            return await Organization.save(organization);
        } else {
            return existingOrganization;
        }
};