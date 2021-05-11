import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { callResolver } from "../../test-utils/resolver-caller";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { EventInput } from "../../../src/entities/event.entity";
import { ContextTest } from "../../test-utils/context";
import { getUserIdFromJwt } from "../../../src/utilities/decoding-jwt";
import { UserMockedData } from "../../mock-data/user";
import { User } from "../../../src/entities/user/user.entity";
import { EventMockedData } from "../../mock-data/events";

let connection: Connection;

let regularUser: User;

beforeAll(async() => {
    connection = await testConn();
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
        const getAllEventsQuery: string = `query getAllEvents {
            getAllEvents {
              title
            }
        }`;

        const context = await ContextTest.getContext(username, password);

        const result: any = await callResolver({
            source: getAllEventsQuery,
            contextValue: context
        });

        expect(result.data.getAllEvents.length).toBeGreaterThanOrEqual(1);
    });

    it("get event by id successfully", async()=> {
        const getEventByIdQuery: string = `query getEventById($id: ID!) {
            getEventById(id: $id){
                title
              }
        }`;

        const context = await ContextTest.getContext(username, password);

        const result: any = await callResolver({
            source: getEventByIdQuery,
            variableValues: {
                id: "1"
            },
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                getEventById: {
                        title: "Giving Free Food"
                    }
            }
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
            source: getAllEventsForOrganizationQuery,
            contextValue: context,
            variableValues: {
                organizationId: organizationId
            }
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
            source: addEventMutation,
            variableValues: {
                event: eventInput
            },
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                addEvent: {
                        title: eventInput.title
                    }
            }
        });
    });
});