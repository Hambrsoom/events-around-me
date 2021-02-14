import { Address } from "../../src/entities/address.entity";
import { Event } from "../../src/entities/event.entity";
import { Organization } from "../../src/entities/organization.entity";

export const insertEvent = async() => {
    const existingEvent: Event = await Event.findOne({ where: {
        title: "Giving Free Food"
    }});
    if(existingEvent === undefined){
        const address: Address = new Address();

        address.street = "6880 Chemin de la Côte-de-Liesse";
        address.zipCode = "H4T 2A1";
        address.appartmentNumber = 12;
    
        const event: Event =  new Event();
        event.title = "Giving Free Food";
        event.url = "https://www.moissonmontreal.org/";
        event.address = address;
        event.organizer = await Organization.findOne({ where: { id:1 }});
    
        await Event.save(event);
    }

}