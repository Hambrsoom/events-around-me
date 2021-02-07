import jwt_decode from "jwt-decode";
import { ImageService } from "../services/image.service";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";

import { UserService } from "../services/user.service";
import { Event } from "../entities/event.entity";
import { Role } from "../entities/user.entity";
import { EventService } from "../services/event.service";
import { Organization } from "../entities/organization.entity";
import { OrganizationService } from "../services/organization.service";

export const isImageOwner: MiddlewareFn<Context> = async ({ context, args }, next) => {
    const decoded = jwt_decode(context.req.headers["authorization"]);
    const userId: number = Number(decoded["userId"]);
    const user = await UserService.getUserByID(userId)
    
    if(user.role === Role.organizer) {
        const events: Event[] = await EventService.getAllEventsOfUser(userId);
        let listOfEventIds: number[] = [];
        events.forEach(event => listOfEventIds.push(event.id));
    
        for(let imageID of args.listOfImageIds) {
            if(!ImageService.isOwnerOfImage(listOfEventIds, Number(imageID))) {
                throw new Error(`User is not authorized to delete this picture ${imageID}`);
            }
        }
    }

    return next();
}


export const isEventOwner: MiddlewareFn<Context> = async ({ context, args }, next) => {
    const decoded = jwt_decode(context.req.headers["authorization"]);
    const userId: number = Number(decoded["userId"]);

    const user = await UserService.getUserByID(userId);
    if(user.role === Role.organizer) {
        console.log(user.organization);
        const organization: Organization = await OrganizationService.getOrganizationById(user.organization.id);
        const event: Event = organization.events.find(event => event.id === args.event.id);

        if(event){
            return next();
        } else {
            throw new Error(`User is not authorized to edit or delet this event with id ${args.event.id}`);
        }
    }

    return next();
}