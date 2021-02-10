import { Resolver, Mutation, Arg, Authorized, UseMiddleware } from "type-graphql";
import { GraphQLUpload } from "apollo-server-express";
import { createWriteStream } from "fs";

import { IUpload } from "../types/Upload";
import { isImage } from "../utilities/isImage";
import { ImageService } from "../services/image.service";
import { Role } from '../entities/user.entity';
import { isImageOwner } from "../middlewares/isOwner";

@Resolver()
export class ImageResolver {
  @Mutation(() => Boolean)
  @Authorized([Role.admin, Role.organizer])
  async addImageToEvent(@Arg("pictures", () => [GraphQLUpload])
  pictures: IUpload[], @Arg("eventId") eventId : number): Promise<boolean> {

    for (let picture of pictures) {
      const upload: IUpload = await picture;

      if(!isImage(upload.filename)){
        throw new Error("Only image files are allowed!");
      } else {
        const path = process.cwd() + "\\images\\"+ upload.filename;
  
        await ImageService.addSingleImageToEvent(path, eventId)
  
        new Promise(async (resolve, reject) =>
        upload.createReadStream()
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
  async deleteImage(@Arg("listOfImageIds", () => [Number]) listOfImageIds: number[]): Promise<boolean> {
    await ImageService.deleteImages(listOfImageIds);
    return true;
  }
}
