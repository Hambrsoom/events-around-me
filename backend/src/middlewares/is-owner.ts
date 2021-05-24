import { MiddlewareFn } from "type-graphql";
import { ImageService } from "../services/image.service";

import { Context } from "vm";
import { EventService } from "../services/event/event.service";

export const isImagesOwner: MiddlewareFn<Context> =
  async ({ context, args }, next) => {
    await ImageService.isImagesOwner(context.userId, args.imageIds);
    return next();
};

export const isEventOwner: MiddlewareFn<Context> =
  async ({ context, args }, next) => {
    await EventService.isEventOwner(context.userId, args.eventId);
    return next();
};
