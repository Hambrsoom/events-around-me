import { getCustomRepository } from "typeorm";
import { Address } from "../../src/entities/address/address.entity";
import { Event } from "../../src/entities/event.entity";
import { OrganizationRepository } from "../../src/repositories/organization.repository";
import { AddressInput } from "../../src/types/address-input.type";
import { EventInput } from "../../src/types/event-input.type";

export class EventMockedData {
  public static async getEvent1(
    ): Promise<Event> {
      const organizationRepository = getCustomRepository(OrganizationRepository);
      let address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H4T 2A1";

      const event: Event =  new Event();
      event.title = "Giving Free Food";
      event.url = "https://www.moissonmontreal.org/";
      event.address = address;
      event.date = new Date("2022-01-16");
      event.description = "Good Food";
      event.organizer = await organizationRepository.findOne({where: {id: 1}});
      return event;
  }

  public static async  getEvent2(
    ): Promise<Event> {
      const organizationRepository = getCustomRepository(OrganizationRepository);
      const address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H3A 1W7";
      const event: Event = new Event();
      event.address = address;
      event.title = "Giving up Clothes";
      event.date = new Date("2022-01-16");
      event.url = "https://www.mcgill.ca/daycare/";
      event.description = "Nice clothes";
      event.organizer = await organizationRepository.findOne({where: {id: 1}});
      return event;
  }

  public static async  getEvent3(
    ): Promise<Event> {
      const organizationRepository = getCustomRepository(OrganizationRepository);

      const address: Address = new Address();
      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H2V 4H9";

      const event: Event = new Event();
      event.address = address;
      event.title = "Giving away home equipments";
      event.description = "Brand new equipments";
      event.date = new Date("2022-01-16");
      event.url = "https://www.211qc.ca/en/directory";
      event.organizer = await organizationRepository.findOne({where: {id: 1}});
      return event;
  }

  public static async getEventInput1(
    ): Promise<EventInput> {
      const address: AddressInput = new AddressInput();

      address.street = "10600 Ave du bois-de-boulogne";
      address.postalCode = "H3A 1W7";

      const eventInput: EventInput = new EventInput();
      eventInput.address = address;
      eventInput.title = "Giving up Clothes";
      eventInput.url = "https://www.mcgill.ca/daycare/";
      return eventInput;
  }
}
