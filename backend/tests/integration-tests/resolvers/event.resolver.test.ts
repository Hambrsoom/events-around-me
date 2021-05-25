import { Connection } from "typeorm";
import { Role } from "../../../src/entities/user/user-role.enum";
import { User } from "../../../src/entities/user/user.entity";
import { EventInput } from "../../../src/types/event-input.type";
import { getUserIdFromJwt } from "../../../src/utilities/decoding-jwt";
import { EventMockedData } from "../../mock-data/events";
import { UserMockedData } from "../../mock-data/user";
import { ContextTest } from "../../test-utils/context";
import enviromentalVariablesObject from "../../test-utils/enviromental-variables";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { callResolver } from "../../test-utils/resolver-caller";
import { testConnection } from "../../test-utils/test-connection";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";

let connection: Connection;

let regularUser: User;

beforeAll(async() => {
  connection = await testConnection();
  process.env = enviromentalVariablesObject;
  regularUser = await UserMockedData.getRegularUser();
  await registerUser(regularUser.username, regularUser.password);
  await insertOrganization();
  await insertEvent();
});

afterAll(async() => {
  await connection.close();
});

describe("Get Events", () => {
  const username: string = "Hampic";
  const password: string = "12345678";

  it("get All the events successfully", async() => {
    const getEventsQuery: string = `query getEvent($cursor: CursorInput!) {
      getEvents(cursor: $cursor){
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            ... on Event {
              id
              title
            }
          }
        }
      }
    }`;

    const context = await ContextTest.getContext(username, password);

    const result: any = await callResolver({
      contextValue: context,
      source: getEventsQuery,
      variableValues: {
        cursor: {
          first: 4,
        },
      },
    });
    expect(result.data.getEvents.edges.length).toBeGreaterThanOrEqual(1);
    expect(result.data.getEvents.totalCount).toBeGreaterThanOrEqual(1);

  });

  it("get event by id successfully", async() => {
    const getEventByIdQuery: string = `query getEventById($id: ID!) {
      getEventById(id: $id){
          title
        }
    }`;

    const context = await ContextTest.getContext(username, password);

    const result: any = await callResolver({
      contextValue: context,
      source: getEventByIdQuery,
      variableValues: {
          id: "1",
      },
    });

    expect(result).toMatchObject({
      data: {
        getEventById: {
          title: "Giving Free Food",
        },
      },
    });
  });

  it("get All the events of an organization successfully", async() => {
    const getAllEventsForOrganizationQuery: string = `query getAllEventsForOrganization($organizationId: ID! ){
      getAllEventsForOrganization(organizationId: $organizationId) {
        title
      }
    }`;
    const organizationId: string = "1";
    const context = await ContextTest.getContext(username, password);

    const result: any = await callResolver({
      contextValue: context,
      source: getAllEventsForOrganizationQuery,
      variableValues: {
          organizationId,
      },
    });

    expect(result.data.getAllEventsForOrganization.length).toBeGreaterThanOrEqual(1);
  });
});


describe("add & edit an event", () => {
  const username: string = "MichealOrganization";
  const password: string = "12345678";

  it("add a new event successfully", async()=> {
    await insertUser(username, password, Role.organizer, "1");

    const addEventMutation = `mutation addEvent($event: EventInput!){
      addEvent(event: $event){
        title
      }
    }`;

    const context = await ContextTest.getContext(username, password);
    const eventInput: EventInput = await EventMockedData.getEventInput1();

    const result: any = await callResolver({
      contextValue: context,
      source: addEventMutation,
      variableValues: {
          event: eventInput,
      },
    });

    expect(result).toMatchObject({
      data: {
        addEvent: {
          title: eventInput.title,
        },
      },
    });
  });
});
