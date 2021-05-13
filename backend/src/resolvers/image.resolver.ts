import { Resolver, Mutation, Arg, Authorized, UseMiddleware } from "type-graphql";
import { GraphQLUpload } from "apollo-server-express";

import { IUpload } from "../types/upload";
import { ImageService } from "../services/image.service";
import { Role } from "../entities/user/user-role.enum";
import { isImagesOwner } from "../middlewares/isOwner";

@Resolver()
export class ImageResolver {

  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  async addImageToEvent(
    @Arg("pictures", () => [GraphQLUpload])pictures: IUpload[],
    @Arg("eventId") eventId : string
    ): Promise<boolean> {
      for (let picture of pictures) {
        const uploadedPicture: IUpload = await picture;
        await ImageService.uploadImage(uploadedPicture, eventId);
      }
      return true;
  }

  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  @UseMiddleware(isImagesOwner)
  async deleteImages(
    @Arg("imageIds", () => [String]) imageIds: string[]
    ): Promise<boolean> {
      await ImageService.deleteImages(imageIds);
      return true;
  }
}
