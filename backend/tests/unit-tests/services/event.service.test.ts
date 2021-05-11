import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { Organization } from "../../../src/entities/organization.entity";
import { Event } from "../../../src/entities/event.entity";
import { EventService } from "../../../src/services/event/event.service";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { EventMockedData } from "../../mock-data/events";
import { insertUser } from "../../test-utils/user-helper-methods";
import { User } from "../../../src/entities/user/user.entity";
import { Role } from "../../../src/entities/user/user-role.enum";

import { OrganizationMockedData } from "../../mock-data/organizations";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
    await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

describe("Event service for getting events", () => {

    it("get event by id=1 successfully", async() => {
        const eventId: string = "1";
        const expectedEvent: Event = await EventMockedData.getEvent1();

        const event: Event = await  EventService.getEventById(eventId);

        expect(event.title).toBe(expectedEvent.title);
        expect(event.url).toBe(expectedEvent.url);
    });

    it("get event by id=1789 failure", async() => {
        const eventId : string = "1789";

        try {
            await EventService.getEventById(eventId);
        } catch(err) {
            expect(err.message).toBe(`Could not find the event with id ${eventId}`);
        }
    });

    it("get events successfully", async() => {
        const expectListOfEvents: Event[] = [await EventMockedData.getEvent1()];
        const listOfEvents: Event[] = await EventService.getAllEvents();

        expect(listOfEvents[0].title).toBe(expectListOfEvents[0].title);
        expect(listOfEvents[0].organizer.name).toBe(expectListOfEvents[0].organizer.name);
        expect(listOfEvents[0].address.street).toBe(expectListOfEvents[0].address.street);
    });

    it("get events of an oragizer successfully", async()=> {
        const newOrganization: Organization = await OrganizationMockedData.getOrganization2();
        const organization: Organization = await Organization.save(newOrganization);
        const organizerUsername: string = "HampicoOrganizer";
        const password: string = "123456789";

        await insertUser(organizerUsername, password, Role.organizer, organization.id);
        const event: Event = await  EventMockedData.getEvent2();
        event.organizer = organization;
        await Event.save(event);

        const user: User = await User.findOne({where: {username: "HampicoOrganizer"}});

        const events: Event[] = await EventService.getAllEventsOfUser(user.id);

        expect(events.length).toBeGreaterThan(0);
    });
});


describe("Event service for saving events", () => {

    it("save an event successfully", async() => {
        const newEvent: Event = await EventMockedData.getEvent3();

        const returnedEvemt: Event = await EventService.saveEvent(newEvent);

        expect(returnedEvemt.title).toBe(newEvent.title);
        expect(returnedEvemt.organizer.name).toBe(newEvent.organizer.name);
        expect(returnedEvemt.address.street).toBe(newEvent.address.street);
    });
});