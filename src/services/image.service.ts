import config  from "../../config/config";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";
import { EventService } from "./event/event.service";

const fs:any = require("fs");

export class ImageService {
    public static async getImageByIds(
        imageIds: number[]
        ): Promise<Image[]> {
            try {
                return await Image.findByIds(imageIds);
            } catch(err) {
                throw new Error(`Could not find the images with ids ${imageIds}`);
            }
    }

    public static async addSingleImageToEvent(
        filename: string,
        eventId: number
        ): Promise<Image> {
            let image: Image = new Image();
            const event: Event = await EventService.getEventById(eventId);
            try {
                image.path = `${config.url}${config.appPort}/images/${filename}`;
                image.event = event;
                return Image.save(image);
            } catch (err) {
                throw new Error(`Couldn't store the event with ID ${eventId}`);
            }
    }

    public static async deleteImages(
        imageIds: number[]
        ): Promise<void> {
            const images: Image[] = await ImageService.getImageByIds(imageIds);

            images.forEach(
                async(image) => {
                    const piecesOfPath: string[] = image.path.split["/"];
                    const filename = piecesOfPath[piecesOfPath.length-1];
                    const physicalPath = 
                    await ImageService.deletePhysicalImage(image.path)
                }
            );

            await Image.createQueryBuilder()
            .delete()
            .from(Image)
            .where("id IN (:...ids)", { ids: imageIds })
            .execute()
    }

    public static async deletePhysicalImage(
        path: string
        ): Promise<void> {
            await fs.unlink(path, (err) => {
                if (err) {
                    throw new Error(`Could not delete the image with path ${path}`);
                }
            });
    }

    public static async isOwnerOfImage(
        eventIds: number[],
        imageId: number
        ): Promise<boolean> {
            try {
                const image: Image = await Image.createQueryBuilder()
                .select()
                .where("id = :id and event_id IN (:...ids)", { id: imageId, ids: eventIds })
                .getOne();
                return image? true: false;
            } catch (err) {
                return false;
            }
    }
}