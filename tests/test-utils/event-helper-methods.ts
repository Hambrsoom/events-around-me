import { Address } from "../../src/entities/address/address.entity";
import { Event } from "../../src/entities/event.entity";
import { Organization } from "../../src/entities/organization.entity";
import { EventMockedData } from "../mock-data/events";

export const insertEvent = 
    async() => {
        const existingEvent: Event = await Event.findOne({ where: {
            title: "Giving Free Food"
        }});
        if(existingEvent === undefined) {
            const event: Event = await EventMockedData.getEvent1();

            await Event.save(event);
        }
};