import { Organization } from "../entities/organization.entity";

export class OrganizationService {
    public static async getOrganizationById(
        organizationId: number
        ): Promise <Organization> {

        try {
            return await Organization.findOneOrFail({
                where: { id: organizationId },
                relations: ["address", "events"]
            });
        } catch(err) {
            throw new Error(`Could not find the Organization with id ${organizationId}`);
        }
    }

    public static async getOrganizations(
        ): Promise<Organization[]> {
            return await Organization.find({
                relations: ["address", "events"]
            });
    }

    public static async saveOrganization(
        organization: Organization
        ): Promise<Organization> {

        try {
            // To update the organization and the address, it is important to pass the id of organization and the address related to this organization,
            // Otherwise, it will create a new row.
            return await Organization.save(organization);
        } catch(err) {
            throw new Error("Failed in storing the organization since it already exists in the database");
        }
    }
}