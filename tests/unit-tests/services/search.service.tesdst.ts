import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { Organization } from "../../../src/entities/organization.entity";
import { Address } from "../../../src/entities/address.entity";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { Event } from "../../../src/entities/event.entity";
import { SearchService } from "../../../src/services/search.service";
import { registerUser } from "../../test-utils/user-helper-methods";

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
        const address: Address = new Address();

        address.street = "McGill CPE, 3491 Peel St.";
        address.zipCode = "H3A 1W7";

        const event: Event = new Event();
        event.address = address;
        event.title = "Giving up Clothes";
        event.url = "https://www.mcgill.ca/daycare/";
        event.organizer = await Organization.findOne({where: { id: 1}});
        const text: string = "Food";

        await Event.save(event);

        const listOfEvents: Event[] = await SearchService.getEventsByTitle(text);

        expect(listOfEvents.length).toBe(1);
        expect(listOfEvents[0].title).toBe("Giving Free Food");
        expect(listOfEvents[0].url).toBe("https://www.moissonmontreal.org/");
    });
});