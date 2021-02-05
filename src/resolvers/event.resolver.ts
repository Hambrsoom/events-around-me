import { Query, Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql'
import { Address } from '../entities/address.entity';
import { Event, EventInput } from '../entities/event.entity';
import { Organization, OrganizationInput } from '../entities/organization.entity'

@Resolver((of) => Event)
export class EventResolver {

  @Query(() => [Event])
  // @UseMiddleware(checkJwt)
  async getAllEvents(): Promise<Event[]> {
    return await Event.find({
        relations: ["address"]
    });
  }

  @Query(() => [Event])
  // @UseMiddleware(checkJwt)
  async getAllEventsForOrganization(
      @Arg('OrganizationID') organizationID: number
  ): Promise<Event[]> {
    return await Event.find({
        where: { organizer: organizationID }
    });
  }


  @Query(() => Event)
  // @UseMiddleware(checkJwt)
  async getEventByID(
    @Arg('id') id : number
  ): Promise<Event> {
    try {
      const event: Event = await Event.findOneOrFail({
        where: { id },
        relations: ["address"]  
      });
      return event;
    } catch(err){
      throw new Error(`Didn't find the event with id ${id}`)
    }
  }


  @Mutation(() => Event)  
  async addEvent(
    @Arg('event') { title, url, date, address, organizerID }: EventInput
  ): Promise<Event> {
    let organization = new Organization();
    try {
        organization = await Organization.findOne({ 
            where: {id: organizerID}
        })
    } catch(err){
        throw new Error("Organization doesn't exist");
    }
    
    let event = new Event();
    event.title = title;
    event.url = url;
    event.address = address;
    event.date = date;
    event.organizer = organization;


    try {
        console.log(event);
      return await Event.save(event);
    } catch(err) {
        console.log(err);
      throw new Error("Event already exists");
    }
  }

  @Mutation(()=> Event)
  async editEvent(
    @Arg('Event') { id,  title, url, date, address, organizerID  }: EventInput
  ): Promise<Event> {
    let event: Event = new Event();

    try {
        event = await Event.findOne({
          where: {id},
          relations: ["address"]  
        })        
    } catch(err){
      throw new Error("Couldn't find the event");
    }

    if (title) {
      event.title = title;
    } 
    if (url) {
      event.url = url;
    }

    if(date) {
        event.date = date;
    }        

    if(organizerID){
    try {
        const organization: Organization = await Organization.findOne({ 
            where: {organizerID}
        })
        event.organizer = organization;
    } catch(err){
        console.log(err);
        throw new Error("Organization doesn't exist");
    }
    }
  
    if (address && !event.address.equal(address)){
        const newAddress = address;
        Address.save(newAddress);
    }
    
    try {
      console.log(event);
      return await Event.save(event);
    } catch(err) {
      throw new Error("Couldn't update organization")
    }
  }
}