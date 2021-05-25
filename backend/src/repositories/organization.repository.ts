import { EntityRepository, MoreThan, Repository } from "typeorm";
import { Organization } from "../entities/organization.entity";
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
          where: { id: organizationId },
          relations: ["address", "events"],
        });
      } catch (err) {
          throw new NotFoundError(organizationId, "organization", err.message);
      }
  }

  public async findOrganizations(
    ): Promise<Organization[]> {
      return await this.find({
        relations: ["address", "events"],
      });
  }

  public async saveOrganization(
    { name, url, address }: OrganizationInput,
    ): Promise<Organization> {
      try {
        const organization = this.create({
          name,
          url,
          address,
        });
        return await this.save(organization);
      } catch (err) {
        throw new PersistenceError("organization", err.message);
      }
  }

  public async editOrganization(
    organization: Organization,
    ): Promise<Organization> {
      try {
        return await this.save(organization);
      } catch (err) {
        throw new PersistenceError("event", err.message);
      }
  }
}
