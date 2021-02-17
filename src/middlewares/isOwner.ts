import { ImageService } from "../services/image.service";
import { MiddlewareFn } from "type-graphql";

import { EventService } from "../services/event/event.service";
import { Context } from "vm";

export const isImagesOwner: MiddlewareFn<Context> =
    async ({ context, args }, next) => {
        ImageService.isImagesOwner(context.userId, args.imageIds);
        return next();
};

export const isEventOwner: MiddlewareFn<Context> =
    async ({ context, args }, next) => {
        EventService.isEventOwner(context.userId, args.eventId);
        return next();
};