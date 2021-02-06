import { Event } from "../entities/event.entity";
import { Organization } from "../entities/organization.entity";
import { User } from "../entities/user.entity";

export class UserService {
    public static async getUserByID(userID: number): Promise<User> {
        try {
            return await User.findOneOrFail(userID, {
                relations: ["organization"]
            });
        } catch(err) {
            throw new Error(`Could not find a user with id ${userID}`);
        }
    }

    public static async getAllEventsOfUser(userId: number): Promise<Event[]> {
        const user: User = await UserService.getUserByID(userId);
        
        try {
            const organization: Organization = await Organization.findOne(user.organization.id, {
                relations: ["events"]
            });
            return organization.events
        } catch(err){
            throw new Error(`Could not find an organization with id ${user.organization.id}`);
        }
    }
}