import { EntityRepository, MoreThan, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Organization } from "../entities/organization.entity";
import { Role } from "../entities/user/user-role.enum";
import { User} from "../entities/user/user.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import PersistenceError from "../error-handlers/persistence-error.error-handler";
import { OrganizationInput } from "../types/organization-input.type";

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  public async findOrganizationById(
    organizationId: string,
    ): Promise<Organization> {
      try {
        return await this.findOneOrFail({
          relations: ["address", "events"],
          where: { id: organizationId },
        });
      } catch (err) {
          throw new NotFoundError(organizationId, "organization", err.message);
      }
  }

  public async findOrganizations(
    ): Promise<Organization[]> {
      return await Organization.find({
        relations: ["address", "events"],
      });
  }

  public async saveOrganization(
    { name, url, address }: OrganizationInput,
    ): Promise<Organization> {
      try {
        return await Organization.create({
          name,
          url,
          address,
        }).save();
      } catch (err) {
        throw new PersistenceError("event", err.message);
      }
  }
}
