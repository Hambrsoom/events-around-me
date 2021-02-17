import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { gCall } from "../../test-utils/gCall";
import { getAccessToken, insertUser, registerUser } from "../../test-utils/user-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { AddressInput } from "../../../src/entities/address/address.entity";
import { EventInput } from "../../../src/entities/event.entity";
import { getContext } from "../../test-utils/context";
import { Context } from "vm";
import { getEvent1, getEventInput1 } from "../../mock-data/events";


let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
    await registerUser("Hampic", "12345678");
    await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

describe("Get Events", () => {
    const username: string = "Hampic";
    const password: string = "123123123";

    it("get All the events successfully", async() => {
        const getAllEventsQuery: string = `query getAllEvents {
            getAllEvents {
              title
            }
        }`;
        const context: Context = getContext(username, password);

        const result: any = await gCall({
            source: getAllEventsQuery,
            contextValue: context
        });

        expect(result).toMatchObject({
            data: {
                getAllEvents: [
                    {
                        title: "Giving Free Food"
                    }
                ]
            }
        });
    });

    it("get event by id successfully", async()=> {
        const getEventByIdQuery: string = `query getEventById($id: Float!) {
            getEventById(id: $id){
              title
            }
        }`;
        const context: Context = getContext(username, password);

        const result: any = await gCall({
            source: getEventByIdQuery,
            variableValues: {
                id: 1
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
        const getAllEventsForOrganizationQuery: string = `query getAllEventsForOrganization($organizationId: Float! ){
            getAllEventsForOrganization(organizationId: $organizationId) {
              title
            }
        }`;
        const organizationId: string = "1";
        const context: Context = getContext(username, password);

        const result: any = await gCall({
            source: getAllEventsForOrganizationQuery,
            contextValue: context,
            variableValues: {
                organizationId: organizationId
            }
        });

        expect(result).toMatchObject({
            data: {
                getAllEventsForOrganization: [
                    {
                        title: "Giving Free Food"
                    }
                ]
            }
        });
    });
});


describe("add a new event", () => {
    it("add a new event successfully", async()=> {
        const username: string = "organizer1234";
        const password: string = "organizer1234";
        await insertUser(username, password, Role.organizer, 1);

        const addEventMutation = `mutation addEvent($event: EventInput!){
            addEvent(event: $event){
              title
            }
        }`;

        const context: Context = getContext(username, password);
        const eventInput: EventInput = getEventInput1();

        const result: any = await gCall({
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

describe("edit an event", () => {
    it("edit an event successfully", async()=> {
        const editEventMutation = `mutation editEvent($event: EventInput!){
            editEvent(event: $event){
              url
            }
        }`;

        const username: string = "Michael";
        const password: string = "123123123";
        await insertUser(username, password, Role.organizer, 1);
        const context: Context = getContext(username, password);


        const eventInput: EventInput = new EventInput();
        eventInput.url = "https://www.mcgill.ca";
        const eventId: string = "1";

        const result: any = await gCall({
            source: editEventMutation,
            variableValues: {
                eventId: eventId,
                event: eventInput
            },
            contextValue: context
        });


        expect(result).toMatchObject({
            data: {
                editEvent: {
                        url: eventInput.url
                    }
            }
        });
    });
});