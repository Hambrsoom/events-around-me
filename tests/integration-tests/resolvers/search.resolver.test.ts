import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { callResolver } from "../../test-utils/resolver-caller";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { ContextTest } from "../../test-utils/context";

let connection: Connection;

const username: string = "Hampic";
const password: string = "12345678";

beforeAll(async() => {
    connection = await testConn();
    await registerUser(username, password);
    await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

beforeEach(async()=> {
});

describe("Get Events by Search", () => {
    it("get all the events that will work soon by searching their title", async() => {
        const searchForEventsQuery: string = `query searchForEvents($text: String!){
            searchForEvents(text:$text){
              title
            }
        }`;



        const text: string = "Food";

        const context = await ContextTest.getContext(username, password);

        const result: any = await callResolver({
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