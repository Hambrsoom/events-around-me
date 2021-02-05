import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "apollo-server-express";
import { createWriteStream } from "fs";

import { Upload } from "../types/Upload";
import { isImage } from "../utilities/isImage";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(@Arg("picture", () => GraphQLUpload)
  {
    createReadStream,
    filename
  }: Upload, @Arg("eventID") eventID : number): Promise<boolean> {
    console.log("hel");
    if(!isImage(filename)){
      throw new Error("Only image files are allowed!");
    } else {
      let image: Image = new Image();
      let event: Event = new Event();
      try{
        event = await Event.findOne({
          where: { id: eventID }
        })
      } catch(err){
        throw new Error(`Couldn't find the Event with ID ${eventID}`)
      }
      const path = process.cwd() + "\\images\\"+ filename;

      try {
        image.path = path;
        image.event = event;
        Image.save(image);
      }catch (err){
        throw new Error(`Couldn't store the event with ID ${eventID}`)
      }

      return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(path))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
      );
    }
  }
}
