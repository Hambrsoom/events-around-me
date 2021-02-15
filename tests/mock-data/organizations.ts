import { Address } from "../../src/entities/address.entity";
import { Organization } from "../../src/entities/organization.entity";


export const getOrganization1 = () => {
    const address: Address = new Address();
    address.street = "6880 Chemin de la Côte-de-Liesse";
    address.zipCode = "H4T 2A1";
    address.appartmentNumber = 12;

    const organization: Organization =  new Organization();
    organization.name = "Moisson Montreal";
    organization.url = "https://www.moissonmontreal.org/";
    organization.address = address;

    return organization;
};

export const getOrganization2 = () => {
    const address: Address = new Address();
    address.street = "6880 Chemin de la Côte-de-Liesse";
    address.zipCode = "H4T 2A1";
    address.appartmentNumber = 12;

    const organization: Organization =  new Organization();
    organization.name = "new Organization";
    organization.url = "https://www.kooora.com/";
    organization.address = address;

    return organization;
}