import jwt_decode from "jwt-decode";
import { ImageService } from "../services/image.service";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";

import { UserService } from "../services/user.service";
import { Event } from "../entities/event.entity";

export const isOwner: MiddlewareFn<Context> = async ({ context, args }, next) => {
    const decoded = jwt_decode(context.req.headers["authorization"]);
    const events: Event[] = await UserService.getAllEventsOfUser(Number(decoded["userId"]));
    let listOfEventIds: number[] = [];
    events.forEach(event => listOfEventIds.push(event.id));

    for(let imageID of args.listOfImageIds) {
        if(!ImageService.isOwnerOfImage(listOfEventIds, Number(imageID))) {
            throw new Error(`You are not authorized to delete this picture ${imageID} because you are not its owner`);
        }
    }

    return next();
}