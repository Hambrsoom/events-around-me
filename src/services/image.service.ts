import config  from "../../config/config";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";
import { EventService } from "./event.service";

const fs:any = require("fs");

export class ImageService {
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
        }catch (err){
            throw new Error(`Couldn't store the event with ID ${eventId}`)
        }
    }

    public static async deleteImages(
        listOfImageIds: number[]
        ): Promise<void> {

        const path = process.cwd() + "\\images\\ + filename";
        let images:Image[];
        try {
            images = await Image.findByIds(listOfImageIds);
        } catch(err){
            throw new Error(`Could not find the images with ids ${listOfImageIds}`);
        }

        images.forEach(
            async(image) => await ImageService.deletePhysicalImage(image.path)
        );

        await Image.createQueryBuilder()
        .delete()
        .from(Image)
        .where("id IN (:...ids)", { ids: listOfImageIds })
        .execute()
    }

    public static async deletePhysicalImage(
        path: string)
        : Promise<void> {

        await fs.unlink(path, (err) => {
            if (err) {
                throw new Error(`Could not delete the image with path ${path}`);
            }
            console.log(`successfully deleted ${path}`);
        });
    }

    public static async isOwnerOfImage(
        eventIds: number[],
        imageId: number)
        : Promise<boolean> {

        try {
            const image: Image = await Image.createQueryBuilder()
            .select()
            .where("id = :id and event_id IN (:...ids)", { id: imageId, ids: eventIds })
            .getOne()
            return true;
        } catch (err) {
            return false;
        }
    }
}