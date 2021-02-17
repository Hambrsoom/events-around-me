import { Address } from "../../src/entities/address/address.entity";
import { Event } from "../../src/entities/event.entity";
import { getEvent1 } from "../mock-data/events";

export const insertEvent = 
    async() => {
        const existingEvent: Event = await Event.findOne({ where: {
            title: "Giving Free Food"
        }});

        if(existingEvent === undefined) {
            const event: Event = getEvent1();
            return await Event.save(event);
        } else {
            return getEvent1();
        }
};