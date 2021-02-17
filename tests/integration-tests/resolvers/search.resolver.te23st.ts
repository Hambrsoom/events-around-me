import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { gCall } from "../../test-utils/gCall";
import { Organization, OrganizationInput } from "../../../src/entities/organization.entity";
import { Address, AddressInput } from "../../../src/entities/address/address.entity";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
    await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

beforeEach(async()=> {
    await registerUser("Hampic", "12345678");
});

describe("Get Events by Search", () => {
    it("get all the events that will work soon by searching their title", async() => {
        const searchForEventsQuery: string = `query searchForEvents($text: String!){
            searchForEvents(text:$text){
              title
            }
        }`;

        const text: string = "Food";

        const accessToken: string = await getAccessToken("Hampic", "12345678");

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
        const result: any = await gCall({
            source: searchForEventsQuery,
            contextValue: context,
            variableValues: {
                text: text
            }
        });

        expect(result).toMatchObject({
            data: {
                searchForEvents: [
                    {
                        title: "Giving Free Food"
                    }
                ]
            }
        })
    });
});