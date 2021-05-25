import { Connection } from "typeorm";
import { ContextTest } from "../../test-utils/context";
import enviromentalVariablesObject from "../../test-utils/enviromental-variables";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { callResolver } from "../../test-utils/resolver-caller";
import { testConnection } from "../../test-utils/test-connection";
import { registerUser } from "../../test-utils/user-helper-methods";

let connection: Connection;

const username: string = "Hampic";
const password: string = "12345678";

beforeAll(async() => {
  connection = await testConnection();
  process.env = enviromentalVariablesObject;
  await registerUser(username, password);
  await insertOrganization();
  await insertEvent();
});

afterAll(async() => {
  await connection.close();
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
      contextValue: context,
      source: searchForEventsQuery,
      variableValues: {
        text,
      },
    });
    expect(result.data.searchForEvents.length).toBeGreaterThanOrEqual(1);
  });
});
