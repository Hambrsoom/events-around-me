import { getCustomRepository } from "typeorm";
import { Event } from "../../src/entities/event.entity";
import { EventRepository } from "../../src/repositories/event.repository";
import { EventMockedData } from "../mock-data/events";

export const insertEvent =
  async() => {
    const eventRepository = getCustomRepository(EventRepository);
    const existingEvent: Event = await eventRepository.findOne({ where: {
      title: "Giving Free Food",
    }});
    if (existingEvent === undefined) {
      const event: Event = await EventMockedData.getEvent1();
      const newEvent = await eventRepository.save(event);
    }
};
