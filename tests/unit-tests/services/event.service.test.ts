import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { Organization } from "../../../src/entities/organization.entity";
import { OrganizationService } from "../../../src/services/organization.service";
import { Address } from "../../../src/entities/address.entity";
import { Event } from "../../../src/entities/event.entity";
import { EventService } from "../../../src/services/event.service";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { getEvent1, getEvent2, getEvent3 } from "../../mock-data/events";
import { insertUser } from "../../test-utils/user-helper-methods";
import { Role, User } from "../../../src/entities/user.entity";
import { getOrganization1, getOrganization2 } from "../../mock-data/organizations";

let connection: Connection;
let organizationByDefault: Organization;

beforeAll(async() => {
    connection = await testConn();
    organizationByDefault = await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

describe("Event service for getting events", () => {

    it("get event by id=1 successfully", async() => {
        const eventId: number = 1;
        const expectedEvent: Event = getEvent1();
        const event: Event = await  EventService.getEventById(eventId);

        expect(event.title).toBe(expectedEvent.title);
        expect(event.url).toBe(expectedEvent.url);
    });

    it("get event by id=1789 failure", async() => {
        const eventId : number = 1789;

        try {
            await EventService.getEventById(eventId);
        } catch(err) {
            expect(err.message).toBe(`Could not find the event with id ${eventId}`);
        }
    });

    it("get events successfully", async() => {
        const expectListOfEvents: Event[] = [getEvent1()];
        const listOfEvents: Event[] = await  EventService.getAllEvents();

        expect(listOfEvents[0].title).toBe(expectListOfEvents[0].title);
        expect(listOfEvents[0].organizer.name).toBe(expectListOfEvents[0].organizer.name);
        expect(listOfEvents[0].address.street).toBe(expectListOfEvents[0].address.street);
    });

    it("get events of an oragizer successfully", async()=> {
        const organization: Organization = await Organization.save(getOrganization2());
        insertUser("HampicoOrganizer", "123456789", Role.organizer, organization.id);
        const event = getEvent2();
        event.organizer = organization;
        await Event.save(event);

        const user = await User.findOne({where: {username: "HampicoOrganizer"}});

        const events: Event[] = await EventService.getAllEventsOfUser(user.id);

        expect(events.length).toBeGreaterThan(0);
    });
});


describe("Event service for saving events", () => {

    it("save an event successfully", async() => {
        const newEvent: Event = getEvent3();

        const returnedEvemt: Event = await EventService.saveEvent(newEvent);

        expect(returnedEvemt.title).toBe(newEvent.title);
        expect(returnedEvemt.organizer.name).toBe(newEvent.organizer.name);
        expect(returnedEvemt.address.street).toBe(newEvent.address.street);
    });
});