import { getRepository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Image } from "../entities/image.entity";
import { EventService } from "./event.service";

const fs:any = require("fs");

export class ImageService {
    public static async addSingleImageToEvent(path: string, eventId: number): Promise<Image> {
        let image: Image = new Image();
        const event: Event = await EventService.getEventById(eventId);
        try {
            image.path = path;
            image.event = event;
            return Image.save(image);
        }catch (err){
            throw new Error(`Couldn't store the event with ID ${eventId}`)
        }
    }

    public static async deleteImage(path: string): Promise<void> {
        await fs.unlink(path, (err) => {
            if (err) {
                throw err;
            }
            console.log("successfully deleted " + path);
        });
    }

}