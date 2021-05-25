import { EntityRepository, MoreThan, Repository } from "typeorm";
import { Image } from "../entities/image.entity";
import { Organization } from "../entities/organization.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import PersistenceError from "../error-handlers/persistence-error.error-handler";
import { OrganizationInput } from "../types/organization-input.type";

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  public async findImagesByIds(
    imageIds: string[],
  ): Promise<Image[]> {
    try {
        return await Image.findByIds(imageIds);
    } catch (err) {
        throw new NotFoundError(JSON.stringify(imageIds), "images");
    }
  }

  public async saveImage(
    image: Image,
    ): Promise<Image> {
      try {
        return this.save(image);
      } catch (err) {
          throw new PersistenceError("image", err.message);
      }
  }

  public async deleteImages(
    imageIds: string[],
  ): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(Image)
      .where("id IN (:...ids)", { ids: imageIds })
      .execute();
  }

  public async findImageFromEvents(
    eventIds: string[],
    imageId: string,
  ): Promise<Image> {
    return await Image.createQueryBuilder()
      .select()
      .where("id = :id and event_id IN (:...ids)", { id: imageId, ids: eventIds })
      .getOne();
  }
}
