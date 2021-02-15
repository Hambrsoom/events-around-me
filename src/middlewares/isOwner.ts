import jwt_decode from "jwt-decode";
import { ImageService } from "../services/image.service";
import { MiddlewareFn } from "type-graphql";
import { IContext } from "../types/context";

import { UserService } from "../services/user/user.service";
import { Event } from "../entities/event.entity";
import { Role } from "../entities/user/user-role.enum";
import { EventService } from "../services/event/event.service";
import { Organization } from "../entities/organization.entity";
import { OrganizationService } from "../services/organization.service";
import { User } from "../entities/user/user.entity";

export const isImageOwner: MiddlewareFn<IContext> = async ({ context, args }, next) => {
    const userId: number = Number(jwt_decode(context.req.headers["authorization"])["userId"]);
    const user: User = await UserService.getUserByID(userId);

    if(user.role === Role.organizer) {
        const eventsOfUser: Event[] = await EventService.getAllEventsOfUser(userId);
        let eventIds: number[] = [];
        eventsOfUser.forEach(event => eventIds.push(event.id));
        console.log(args.imageIds);
        for(let imageID of args.imageIds) {
            if(!ImageService.isOwnerOfImage(eventIds, Number(imageID))) {
                throw new Error(`User is not authorized to delete this picture ${imageID}`);
            }
        }
    }

    return next();
};


export const isEventOwner: MiddlewareFn<IContext> = async ({ context, args }, next) => {
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