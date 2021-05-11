import { Organization } from "../entities/organization.entity";
import { ErrorMessage } from "../utilities/error-message";

export class OrganizationService {
    public static async getOrganizationById(
        organizationId: string
        ): Promise <Organization> {

        try {
            return await Organization.findOneOrFail({
                where: { id: organizationId },
                relations: ["address", "events"]
            });
        } catch(err) {
            ErrorMessage.notFoundErrorMessage(organizationId, "organization");
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
            return await Organization.save(organization);
        } catch(err) {
            ErrorMessage.failedToStoreErrorMessage("organization");
        }
    }
}