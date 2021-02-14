import { Connection } from "typeorm";
import { testConn } from "../test-utils/testConn";
import { gCall } from "../test-utils/gCall";
import { getAccessToken, insertUser, registerUser } from "../test-utils/user-helper-methods";
import { insertOrganization } from "../test-utils/organisation-helper-methods";
import { insertEvent } from "../test-utils/event-helper-methods";
import { Role } from "../../src/entities/user.entity";
import { AddressInput } from "../../src/entities/address.entity";
import { EventInput } from "../../src/entities/event.entity";


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
    it("get All the events successfully", async() => {
        const getAllEventsQuery: string = `query getAllEvents {
            getAllEvents {
              title
            }
        }`;

        const accessToken: string = await getAccessToken("Hampic", "12345678");

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
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
        })
    });

    it("get event by id successfully", async()=> {
        const getEventByIdQuery: string = `query getEventById($id: Float!) {
            getEventById(id: $id){
              title
            }
        }`;

        const accessToken: string = await getAccessToken("Hampic", "12345678");

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
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

        const accessToken: string = await getAccessToken("Hampic", "12345678");

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
        const result: any = await gCall({
            source: getAllEventsForOrganizationQuery,
            contextValue: context,
            variableValues: {
                organizationId: 1
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
        })
    });
});


describe("add a new event", () => {
    it("add a new organization successfully", async()=> {
        const username: string = "organizer1234";
        const password: string = "organizer1234";
        await insertUser(username, password, Role.organizer, 1);
        const accessToken: string = await getAccessToken(username, password);

        const addEventMutation = `mutation addEvent($event: EventInput!){
            addEvent(event: $event){
              title
            }
        }`;

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
        const address: AddressInput = new AddressInput();

        address.street = "McGill CPE, 3491 Peel St.";
        address.zipCode = "H3A 1W7";

        const eventInput: EventInput = new EventInput();
        eventInput.address = address;
        eventInput.title = "Giving up Clothes";
        eventInput.url = "https://www.mcgill.ca/daycare/";
        eventInput.organizerId = 1;

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
    it("add an event successfully", async()=> {
        const username: string = "organizer1234";
        const password: string = "organizer1234";
        await insertUser(username, password, Role.organizer, 1);
        const accessToken: string = await getAccessToken(username, password);

        const editEventMutation = `mutation editEvent($event: EventInput!){
            editEvent(event: $event){
              url
            }
        }`;

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };

        const eventInput: EventInput = new EventInput();
        eventInput.id = 1;
        eventInput.url = "https://www.mcgill.ca";

        const result: any = await gCall({
            source: editEventMutation,
            variableValues: {
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