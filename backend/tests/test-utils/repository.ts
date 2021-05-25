import { getCustomRepository } from "typeorm";
import { EventRepository } from "../../src/repositories/event.repository";
import { OrganizationRepository } from "../../src/repositories/organization.repository";
import { UserRepository } from "../../src/repositories/user.repository";

export const organizationRepository = getCustomRepository(OrganizationRepository);
export const userRepository = getCustomRepository(UserRepository);
export const eventRepository = getCustomRepository(EventRepository);
