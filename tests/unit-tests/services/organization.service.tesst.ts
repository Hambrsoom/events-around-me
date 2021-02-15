import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import jwt_decode from "jwt-decode";
import { registerUser } from "../../test-utils/user-helper-methods";
import { UserService } from "../../../src/services/user/user.service";
import { Role } from "../../../src/entities/user/user-role.enum";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import bcrypt from "bcrypt";
import { Organization } from "../../../src/entities/organization.entity";
import { OrganizationService } from "../../../src/services/organization.service";
import faker from "faker"
import { Address } from "../../../src/entities/address.entity";
let connection: Connection;
let organizationByDefault: Organization;

beforeAll(async() => {
    connection = await testConn();
    await registerUser("Hampic", "12345678");
    organizationByDefault = await insertOrganization();
});

afterAll(async() => {
    await connection.close();
});

describe("Organization service for getting organization by id", () => {

    it("get organization by id=1 successfully", async() => {
        const organizationId: number = 1;
        const organization: Organization = await  OrganizationService.getOrganizationById(organizationId);

        expect(organization.address).toBe(organizationByDefault.address);
        expect(organization.url).toBe(organizationByDefault.url);
        expect(organization.name).toBe(organizationByDefault.name);
    });

    it("get organization by id=1789 failure", async() => {
        const organizationId: number = 1789;

        try {
            await OrganizationService.getOrganizationById(organizationId);
        } catch(err) {
            expect(err.message).toBe(`Could not find the Organization with id ${organizationId}`);
        }
    });
});

describe("Organization service for saving organizations", () => {

    it("save an organization successfully", async() => {
        const address: Address = new Address();
        address.street = "11822 Ave de Bois-de-Boulogne";
        address.zipCode = "H3M 2X6";

        const organization: Organization = new Organization();
        organization.name = "CLSC";
        organization.url = "https://santemontreal.qc.ca/en/public/montreals-institutions-at-a-glance/clscs/";
        organization.address = address;
        organization.events = [];

        const returnedOrganization: Organization = await OrganizationService.saveOrganization(organization);

        expect(returnedOrganization).toBe(organization);
    });

    it("save a user failure for duplicated organization name", async() => {
        const address: Address = new Address();

        address.street = "6880 Chemin de la Côte-de-Liesse";
        address.zipCode = "H4T 2A1";
        address.appartmentNumber = 12;

        const organization: Organization =  new Organization();
        organization.name = "Moisson Montreal";
        organization.url = "https://www.moissonmontreal.org/";
        organization.address = address;

        try {
            await OrganizationService.saveOrganization(organization)
        } catch(err) {
            expect(err.message).toBe("Failed in storing the organization since it already exists in the database");
        }
    });
});


describe("organization service for editing an organization", () => {
    it("edit an orgization successfully", async() => {
        const organization: Organization =  new Organization();
        organization.url = "https://santemontreal.qc.ca/en/public/montreals-institutions-at-a-glance/clscs/";
        organization.id = 1;

        const returnedOrganization: Organization = await OrganizationService.saveOrganization(organization);

        expect(returnedOrganization.url).toBe(organization.url);
    });

});
