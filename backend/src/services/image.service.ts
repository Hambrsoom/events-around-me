import { ForbiddenError, UserInputError } from "apollo-server-errors";
import { createWriteStream } from "fs";
import fs from "fs";
import { getCustomRepository } from "typeorm";
import config  from "../../config/config";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";
import OwnershipError from "../error-handlers/ownership.error-handler";
import { ImageRepository } from "../repositories/image.repository";
import { IUpload } from "../types/upload.type";
import { isImage } from "../utilities/isImage";
import { EventService } from "./event/event.service";

export class ImageService {
  public static async getImageByIds(
    imageIds: string[],
    ): Promise<Image[]> {
      const imageRepository = getCustomRepository(ImageRepository);
      return await imageRepository.findImagesByIds(imageIds);
  }

  public static async uploadImage(
    uploadedPicture: IUpload,
    eventId: string,
    ): Promise<void> {
      if (!isImage(uploadedPicture.filename)) {
          throw new UserInputError("Only image files are allowed!");
      } else {
        const path: string = `${process.cwd()}\\images\\${uploadedPicture.filename}`;
        await ImageService.addSingleImageToEvent(uploadedPicture.filename, eventId);

        // tslint:disable-next-line:no-unused-new
        new Promise(async (resolve, reject) =>
          uploadedPicture.createReadStream()
            .pipe(createWriteStream(path))
            .on("finish", () => resolve(true))
            .on("error", () => reject(false)),
        );
      }
  }

  public static async addSingleImageToEvent(
    filename: string,
    eventId: string,
    ): Promise<Image> {
      let image: Image = new Image();
      const event: Event = await EventService.getEventById(eventId);
      image.path = `${config.url}${config.appPort}/images/${filename}`;
      image.event = event;

      const imageRepository = getCustomRepository(ImageRepository);
      return await imageRepository.saveImage(image);
  }

  public static async deleteImages(
    imageIds: string[],
    ): Promise<void> {
      const images: Image[] = await ImageService.getImageByIds(imageIds);

      images.forEach(
        async(image) => {
          const piecesOfPath: string[] = image.path.split("/");
          const physicalPath: string = `${process.cwd()}\\images\\${piecesOfPath[piecesOfPath.length - 1]}`;
          await ImageService.deletePhysicalImage(physicalPath);
        },
      );

      const imageRepository = getCustomRepository(ImageRepository);
      return await imageRepository.deleteImages(imageIds);
  }

  public static async deletePhysicalImage(
    path: string,
    ): Promise<void> {
      await fs.unlink(path, (err) => {
        if (err) {
          throw new Error(`Could not delete the image with path ${path}`);
        }
      });
  }

  public static async isImagesOwner(
    userId: string,
    imageIds: string[],
    ): Promise<boolean> {
      const eventsOfUser: Event[] = await EventService.getEventsOfUser(userId);
      let eventIds: string[] = [];
      eventsOfUser.forEach((event) => eventIds.push(event.id));

      for (let imageID of imageIds) {
        const isOwner: boolean = await ImageService.isImageBelongToOneOfEvents(eventIds, imageID);
        if (!isOwner) {
          throw new OwnershipError(imageID, "image");
        }
      }
      return true;
  }

  public static async isImageBelongToOneOfEvents(
    eventIds: string[],
    imageId: string,
    ): Promise<boolean> {
      const imageRepository = getCustomRepository(ImageRepository);
      const image: Image = await imageRepository.findImageFromEvents(eventIds, imageId);
      return image !== undefined ? true : false;
  }
}
