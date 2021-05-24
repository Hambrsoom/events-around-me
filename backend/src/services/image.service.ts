import { ForbiddenError, UserInputError } from "apollo-server-errors";
import { createWriteStream } from "fs";
import config  from "../../config/config";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";
import { Role } from "../entities/user/user-role.enum";
import { User } from "../entities/user/user.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import OwnershipError from "../error-handlers/ownership.error-handler";
import StoringError from "../error-handlers/persistence-error.error-handler";
import { IUpload } from "../types/upload.type";
import { isImage } from "../utilities/isImage";
import { EventService } from "./event/event.service";
import { UserService } from "./user/user.service";

const fs: any = require("fs");

export class ImageService {
    public static async getImageByIds(
        imageIds: string[],
        ): Promise<Image[]> {
            try {
                return await Image.findByIds(imageIds);
            } catch (err) {
                throw new NotFoundError(JSON.stringify(imageIds), "images");
            }
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
            try {
                image.path = `${config.url}${config.appPort}/images/${filename}`;
                image.event = event;
                return Image.save(image);
            } catch (err) {
                throw new StoringError("image");
            }
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

            await Image.createQueryBuilder()
            .delete()
            .from(Image)
            .where("id IN (:...ids)", { ids: imageIds })
            .execute();
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
            const user: User = await UserService.getUserByID(userId);

            if (user.role === Role.organizer) {
                const eventsOfUser: Event[] = await EventService.getAllEventsOfUser(userId);
                let eventIds: string[] = [];
                eventsOfUser.forEach((event) => eventIds.push(event.id));

                for (let imageID of imageIds) {
                    const isImageOwner: boolean = await ImageService.isImageBelongToOneOfEvents(eventIds, imageID);
                    if (!isImageOwner) {
                        throw new OwnershipError(imageID, "image");
                    }
                }
            }
            return true;
    }

    public static async isImageBelongToOneOfEvents(
        eventIds: string[],
        imageId: string,
        ): Promise<boolean> {
            try {
                const image: Image = await Image.createQueryBuilder()
                .select()
                .where("id = :id and event_id IN (:...ids)", { id: imageId, ids: eventIds })
                .getOne();
                return image !== undefined ? true : false;
            } catch (err) {
                return false;
            }
    }
}