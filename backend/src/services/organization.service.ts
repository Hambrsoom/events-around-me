import { Organization, OrganizationInput } from "../entities/organization.entity";
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
        { name, url, address }: OrganizationInput,
        ): Promise<Organization> {
            try {
                const organization: Organization = await Organization.create({
                    name,
                    url,
                    address
                }).save();
                return organization;
            } catch(err) {
                ErrorMessage.failedToStoreErrorMessage("organization");
            }
    }

    public static async editOrganizationById(
        { name, url, address }: OrganizationInput,
        organizationId: string
    ): Promise<Organization> {
        try{
            let organization: Organization = await OrganizationService.getOrganizationById(organizationId);

            organization.name = name || organization.name;
            organization.url = url || organization.url;

            if (address && !organization.address.equal(address)) {
                organization.address = address;
                organization.address.id = organization.address.id;
            }
            return await Organization.save(organization);
        } catch(err) {
            ErrorMessage.failedToStoreErrorMessage("organization");
        }
    }
}