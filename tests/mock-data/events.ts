import { Address } from "../../src/entities/address.entity";
import { Event } from "../../src/entities/event.entity";
import { getOrganization1 } from "./organizations";


export const getEvent1 = () => {
    let address: Address = new Address();
    address.street = "6880 Chemin de la Côte-de-Liesse";
    address.zipCode = "H4T 2A1";
    address.appartmentNumber = 12;

    const event: Event =  new Event();
    event.title = "Giving Free Food";
    event.url = "https://www.moissonmontreal.org/";
    event.address = address;
    event.organizer = getOrganization1();
    event.images = [];
    return event;
};


export const getEvent2 = () => {
    const address: Address = new Address();
    address.street = "McGill CPE, 3491 Peel St.";
    address.zipCode = "H3A 1W7";

    const event: Event = new Event();
    event.address = address;
    event.title = "Giving up Clothes";
    event.url = "https://www.mcgill.ca/daycare/";
    event.organizer = getOrganization1();
    return event;
}

export const getEvent3 = () => {
    const address: Address = new Address();
    address.street = "6700 Av du Parc";
    address.zipCode = "H2V 4H9";

    const event: Event = new Event();
    event.address = address;
    event.title = "Giving away home equipments";
    event.url = "https://www.211qc.ca/en/directory";
    event.organizer = getOrganization1();
    return event;
}

