import { Resolver, Mutation, Arg, Authorized, UseMiddleware } from "type-graphql";
import { GraphQLUpload } from "apollo-server-express";
import { createWriteStream } from "fs";

import { IUpload } from "../types/upload";
import { isImage } from "../utilities/isImage";
import { ImageService } from "../services/image.service";
import { Role } from "../entities/user/user-role.enum";
import { isImageOwner } from "../middlewares/isOwner";

@Resolver()
export class ImageResolver {
  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  async addImageToEvent(
    @Arg("pictures", () => [GraphQLUpload])pictures: IUpload[],
    @Arg("eventId") eventId : number
    ): Promise<boolean> {
      for (let picture of pictures) {
        const uploadedPicture: IUpload = await picture;

        if(!isImage(uploadedPicture.filename)) {
          throw new Error("Only image files are allowed!");
        } else {
          const path: string = `${process.cwd()}\\images\\${uploadedPicture.filename}`;

          await ImageService.addSingleImageToEvent(uploadedPicture.filename, eventId);

          new Promise(async (resolve, reject) =>
          uploadedPicture.createReadStream()
            .pipe(createWriteStream(path))
            .on("finish", () => resolve(true))
            .on("error", () => reject(false))
          );
        }
      }
      return true;
  }

  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  @UseMiddleware(isImageOwner)
  async deleteImages(
    @Arg("imageIds", () => [Number]) imageIds: number[]
    ): Promise<boolean> {
      await ImageService.deleteImages(imageIds);
      return true;
  }
}
