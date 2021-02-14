import { Address } from "../../src/entities/address.entity";
import { Organization } from "../../src/entities/organization.entity";

export const insertOrganization = async() => {
    const existingOrganization: Organization = await Organization.findOne({ where: {
        name: "Moisson Montreal"
    }});

    if(existingOrganization === undefined) {
        const address: Address = new Address();

        address.street = "6880 Chemin de la Côte-de-Liesse";
        address.zipCode = "H4T 2A1";
        address.appartmentNumber = 12;

        const organization: Organization =  new Organization();
        organization.name = "Moisson Montreal";
        organization.url = "https://www.moissonmontreal.org/";
        organization.address = address;

        await Organization.save(organization);
    }
};