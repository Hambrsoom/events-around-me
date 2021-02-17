import { Connection } from "typeorm";

import { testConn } from "../../test-utils/testConn";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { Organization } from "../../../src/entities/organization.entity";
import { OrganizationService } from "../../../src/services/organization.service";
import { OrganizationMockedData } from "../../mock-data/organizations";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();

    await insertOrganization();
});

afterAll(async() => {
    await connection.close();
});

describe("Organization service for getting organization by id", () => {

    it("get organization by id=1 successfully", async() => {
        const organizationId: string = "1";
        const organization: Organization = await  OrganizationService.getOrganizationById(organizationId);
        const expectedOrganization: Organization = await OrganizationMockedData.getOrganization1();
        expect(organization.address.street).toBe(expectedOrganization.address.street);
        expect(organization.url).toBe(expectedOrganization.url);
        expect(organization.name).toBe(expectedOrganization.name);
    });

    it("get organization by id=1789 failure", async() => {
        const organizationId: string = "1789";

        try {
            await OrganizationService.getOrganizationById(organizationId);
        } catch(err) {
            expect(err.message).toBe(`Could not find the organization with id ${organizationId}`);
        }
    });
});

describe("Organization service for saving organizations", () => {

    it("save an organization successfully", async() => {
        const organization: Organization = await OrganizationMockedData.getOrganization3();

        const returnedOrganization: Organization = await OrganizationService.saveOrganization(organization);

        expect(returnedOrganization).toBe(organization);
    });

    it("save a user failure for duplicated organization name", async() => {
        const organization: Organization = await OrganizationMockedData.getOrganization1();


        try {
            await OrganizationService.saveOrganization(organization)
        } catch(err) {
            expect(err.message).toBe("Failed in storing the organization in the database");
        }
    });
});
