import { GraphQLUpload } from "apollo-server-express";
import { Arg, Authorized, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Role } from "../entities/user/user-role.enum";
import { isImagesOwner } from "../middlewares/is-owner";
import { ImageService } from "../services/image.service";
import { IUpload } from "../types/upload.type";

@Resolver()
export class ImageResolver {

  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  public async addImageToEvent(
    @Arg("pictures", () => [GraphQLUpload])pictures: IUpload[],
    @Arg("eventId") eventId : string,
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
  public async deleteImages(
    @Arg("imageIds", () => [String]) imageIds: string[],
    ): Promise<boolean> {
      await ImageService.deleteImages(imageIds);
      return true;
  }
}
