import { Address } from "../../src/entities/address/address.entity";
import { Organization } from "../../src/entities/organization.entity";

export class OrganizationMockedData {

    public static async getOrganization1(
        ): Promise<Organization> {
            const address: Address = new Address();
            address.street = "6880 Chemin de la Côte-de-Liesse";
            address.postalCode = "H4T 2A1";
            address.appartmentNumber = 12;

            const organization: Organization =  new Organization();
            organization.name = "Moisson Montreal";
            organization.url = "https://www.moissonmontreal.org/";
            organization.address = address;
            return organization;
    };

    public static async getOrganization2(
        ): Promise<Organization> {
            const address: Address = new Address();
            address.street = "6880 Chemin de la Côte-de-Liesse";
            address.postalCode = "H4T 2A1";
            address.appartmentNumber = 12;

            const organization: Organization =  new Organization();
            organization.name = "new Organization";
            organization.url = "https://www.kooora.com/";
            organization.address = address;

            return organization;
    };

    public static async getOrganization3(
        ): Promise<Organization> {
            const address: Address = new Address();
            address.street = "11822 Ave de Bois-de-Boulogne";
            address.postalCode = "H3M 2X6";

            const organization: Organization = new Organization();
            organization.name = "CLSC";
            organization.url = "https://santemontreal.qc.ca/en/public/montreals-institutions-at-a-glance/clscs/";
            organization.address = address;

            return organization;
    };
}
