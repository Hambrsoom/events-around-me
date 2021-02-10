import { sign } from "jsonwebtoken";
import { User } from "../entities/user.entity";
import config from "../../config/config";

export class UserService {
    public static async getJwt(
        username: string,
        userId: number
        ): Promise<any> {

            return {
                accessToken: sign(
                  { userId: userId, username: username },
                  config.jwtSecret, 
                  { expiresIn: "1h"}
                )
              };
    }

    public static async saveUser(
        user: User
        ): Promise<void> {   
        
        try {
            await User.insert(user);
        } catch (err) {
            throw new Error("Failed in storing the user");
        }
    }

    public static async getUserByID(
        userID: number
        ): Promise<User> {
        
        try {
            return await User.findOneOrFail(userID, {
                relations: ["organization"]
            });
        } catch(err) {
            throw new Error(`Could not find a user with id ${userID}`);
        }
    }
}