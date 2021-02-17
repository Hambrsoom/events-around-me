import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { Organization } from "../../../src/entities/organization.entity";
import { Address } from "../../../src/entities/address/address.entity";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { Event } from "../../../src/entities/event.entity";
import { SearchService } from "../../../src/services/search.service";
import { registerUser } from "../../test-utils/user-helper-methods";
import { EventMockedData } from "../../mock-data/events";

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

describe("Get Events by Search", () => {
    it("get all the events that will work soon by searching their title", async() => {
        const event: Event = await EventMockedData.getEvent2();
        const text: string = "Giving"

        await Event.save(event);

        const listOfEvents: Event[] = await SearchService.getEventsByTitle(text);

        expect(listOfEvents.length).toBeGreaterThan(0);
        expect(listOfEvents[0].title).toBe("Giving Free Food");
        expect(listOfEvents[0].url).toBe("https://www.moissonmontreal.org/");
    });
});