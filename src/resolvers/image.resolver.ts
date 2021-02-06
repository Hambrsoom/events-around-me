import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "apollo-server-express";
import { createWriteStream } from "fs";

import { Upload } from "../types/Upload";
import { isImage } from "../utilities/isImage";
import { ImageService } from "../services/image.service";

@Resolver()
export class ImageResolver {
  @Mutation(() => Boolean)
  async addImageToEvent(@Arg("pictures", () => [GraphQLUpload])
  pictures: Upload[], @Arg("eventId") eventId : number): Promise<boolean> {

    for (let picture of pictures) {
      const upload: Upload = await picture;

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
}
