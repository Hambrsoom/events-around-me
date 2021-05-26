import { getCustomRepository } from "typeorm";
import { EventRepository } from "../repositories/event.repository";
import { ImageRepository } from "../repositories/image.repository";
import { OrganizationRepository } from "../repositories/organization.repository";
import { UserRepository } from "../repositories/user.repository";

export const organizationRepository = getCustomRepository(OrganizationRepository);
export const userRepository = getCustomRepository(UserRepository);
export const eventRepository = getCustomRepository(EventRepository);
export const imageRepository = getCustomRepository(ImageRepository);
