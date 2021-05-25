import { Connection, getCustomRepository } from "typeorm";
import { Event } from "../../../src/entities/event.entity";
import { EventRepository } from "../../../src/repositories/event.repository";
import { SearchService } from "../../../src/services/search.service";
import { EventMockedData } from "../../mock-data/events";
import enviromentalVariablesObject from "../../test-utils/enviromental-variables";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { testConnection } from "../../test-utils/test-connection";
import { registerUser } from "../../test-utils/user-helper-methods";

let connection: Connection;
beforeAll(async() => {
  connection = await testConnection();
  process.env = enviromentalVariablesObject;
  await registerUser("Hampic", "12345678");
  await insertOrganization();
  await insertEvent();
});

afterAll(async() => {
  await connection.close();
});

describe("Get Events by Search", () => {
  it("get all the events that will work soon by searching their title", async() => {
    const eventRepository = getCustomRepository(EventRepository);
    const event: Event = await EventMockedData.getEvent2();
    const text: string = "Giving"

    await eventRepository.save(event);

    const listOfEvents: Event[] = await SearchService.getEventsByTitle(text);

    expect(listOfEvents.length).toBeGreaterThan(0);
    expect(listOfEvents[0].title).toBe("Giving Free Food");
    expect(listOfEvents[0].url).toBe("https://www.moissonmontreal.org/");
  });
});
