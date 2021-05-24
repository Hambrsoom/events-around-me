import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { callResolver } from "../../test-utils/resolver-caller";
import { Organization, OrganizationInput } from "../../../src/entities/organization.entity";
import { Address, AddressInput } from "../../../src/entities/address/address.entity";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { ContextTest } from "../../test-utils/context";
import { Context } from "vm";
import { OrganizationMockedData } from "../../mock-data/organizations";
let connection: Connection;

const username: string = "Hampic";
const password: string = "12345678";

beforeAll(async() => {
    connection = await testConn();
    await registerUser(username, password);
    await insertOrganization();
});

afterAll(async() => {
    await connection.close();
});

describe("Get Organizations", () => {
    it("get All the organizations successfully", async() => {
        const getAllOrganizationsQuery: string = `query getOrganizations {
            getOrganizations {
              name
            }
        }`;

        const context = await ContextTest.getContext(username, password);

        const result: any = await callResolver({
            source: getAllOrganizationsQuery,
            contextValue: context
        });

        expect(result.data.getOrganizations.length).toBeGreaterThanOrEqual(1);
    });

    it("get the organization by id successfully", async()=> {
        const getOrganizationByIdQuery: string = `query getOrganizationById ($id: ID!) {
            getOrganizationById(id: $id){
              name
            }
        }`;

        const context = await ContextTest.getContext(username, password);

        const result: any = await callResolver({
            source: getOrganizationByIdQuery,
            variableValues: {
                id: 1
            },
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                getOrganizationById: {
                        name: "Moisson Montreal"
                    }
            }
        });
    });
});


describe("add & edit an organization", () => {
    const adminUsername: string = "Admine1234";
    const adminPassword: string = "123123123";
    it("add a new organization successfully", async()=> {
        const addOrganizationMutation = `mutation addOrganization($organization: OrganizationInput!){
            addOrganization(organization: $organization) {
              name
            }
        }`;

        await insertUser(adminUsername, adminPassword, Role.admin);


        const context = await ContextTest.getContext(adminUsername, adminPassword);

        const organization: OrganizationInput = await OrganizationMockedData.getOrganizationInput1();
        const result: any = await callResolver({
            source: addOrganizationMutation,
            variableValues: {
                organization: organization
            },
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                addOrganization: {
                        name: "McGill Childcare Centre"
                    }
            }
        });
    });

    it("edit the url of an organization successfully", async()=> {
        const editOrganizationMutation = `mutation editOrganization($organizationId: ID!, $organization: OrganizationInput!) {
            editOrganization(organizationId: $organizationId, organization:$organization){
                        url
                      }
            }`;

        await insertUser(adminUsername, adminPassword, Role.admin);

        const context = await ContextTest.getContext(adminUsername, adminPassword);


        const organizationInput: OrganizationInput = new OrganizationInput();
        organizationInput.url = "https://www.mcgill.ca/";
        const id: string = "1";

        const result: any = await callResolver({
            source: editOrganizationMutation,
            variableValues: {
                organizationId: id,
                organization: organizationInput
            },
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                editOrganization: {
                        url: "https://www.mcgill.ca/"
                    }
            }
        });
    });
});
