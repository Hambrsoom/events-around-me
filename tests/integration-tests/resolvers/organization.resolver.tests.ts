import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { callResolver } from "../../test-utils/resolver-caller";
import { Organization, OrganizationInput } from "../../../src/entities/organization.entity";
import { Address, AddressInput } from "../../../src/entities/address/address.entity";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { getContext } from "../../test-utils/context";
import { Context } from "vm";
let connection: Connection;
const username: string = "Hampic";
const password: string = "12345678";

beforeAll(async() => {
    connection = await testConn();
    await registerUser("Hampic", "12345678");
    await insertOrganization();
});

afterAll(async() => {
    await connection.close();
});

describe("Get Organizations", () => {
    it("get All the organizations successfully", async() => {
        const getAllOrganizationQuery: string = `query getOrganizations {
            getOrganizations {
              name
            }
        }`;

        const context: Context = getContext(username, password);

        const result: any = await callResolver({
            source: getAllOrganizationQuery,
            contextValue: context
        });

        console.log(result);

        expect(result).toMatchObject({
            data: {
                getOrganizations: [
                    {
                        name: "Moisson Montreal"
                    }
                ]
            }
        })
    });

    // it("get the organization by id successfully", async()=> {
    //     const getOrganizationByIdQuery: string = `query getOrganizationById ($id: Float!) {
    //         getOrganizationById(id: $id){
    //           name
    //         }
    //     }`;

    //     const accessToken: string = await getAccessToken("Hampic", "12345678");

    //     const context = {
    //         req: {
    //             headers: {
    //                 authorization: accessToken
    //             }
    //         }
    //     };
    //     const result: any = await gCall({
    //         source: getOrganizationByIdQuery,
    //         variableValues: {
    //             id: 1
    //         },
    //         contextValue: context
    //     });

    //     expect(result).toMatchObject({
    //         data: {
    //             getOrganizationById: {
    //                     name: "Moisson Montreal"
    //                 }
    //         }
    //     });
    // });
});


// describe("add a new organization", () => {
//     it("add a new organization successfully", async()=> {
//         await insertUser("Admin1234", "Admin1234", Role.admin);
//         const accessToken: string = await getAccessToken("Admin1234", "Admin1234");

//         const addOrganizationMutation = `mutation addOrganization($organization: OrganizationInput!){
//             addOrganization(organization: $organization) {
//               name
//             }
//           }`;

//         const context = {
//             req: {
//                 headers: {
//                     authorization: accessToken
//                 }
//             }
//         };
//         const address: AddressInput = new AddressInput();

//         address.street = "McGill CPE, 3491 Peel St.";
//         address.zipCode = "H3A 1W7";

//         const organizationInput: OrganizationInput = new OrganizationInput();
//         organizationInput.addressInput = address;
//         organizationInput.name = "McGill Childcare Centre";
//         organizationInput.url = "https://www.mcgill.ca/daycare/";

//         const result: any = await gCall({
//             source: addOrganizationMutation,
//             variableValues: {
//                 organization: organizationInput
//             },
//             contextValue: context
//         });

//         expect(result).toMatchObject({
//             data: {
//                 addOrganization: {
//                         name: "McGill Childcare Centre"
//                     }
//             }
//         });
//     });
// });

// describe("edit the url of an organization", () => {
//     it("edit the url of an organization successfully", async()=> {
//         await insertUser("Admin1234", "Admin1234", Role.admin);
//         const accessToken: string = await getAccessToken("Admin1234", "Admin1234");

//         const editOrganizationMutation = `mutation editOrganization($organization: OrganizationInput!){
//             editOrganization(organization: $organization) {
//               url
//             }
//         }`;

//         const context = {
//             req: {
//                 headers: {
//                     authorization: accessToken
//                 }
//             }
//         };

//         const organizationInput: OrganizationInput = new OrganizationInput();
//         organizationInput.url = "https://www.mcgill.ca/";
//         organizationInput.id = 1;

//         const result: any = await gCall({
//             source: editOrganizationMutation,
//             variableValues: {
//                 organization: organizationInput
//             },
//             contextValue: context
//         });

//         expect(result).toMatchObject({
//             data: {
//                 editOrganization: {
//                         url: "https://www.mcgill.ca/"
//                     }
//             }
//         });
//     });
// });







