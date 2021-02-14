import { sign } from "jsonwebtoken";
import { User } from "../entities/user.entity";
import config from "../../config/config";

export class UserService {
    public static getAccessToken(
        username: string,
        userId: number
        ): string {

            return sign(
                  { userId: userId, username: username },
                  config.accessTokenSecretKey,
                  { expiresIn: "1h"}
            );
    }

    public static getRefreshToken(
        username: string,
        userId: number
        ): string {

            return sign(
                  { userId: userId, username: username },
                  config.refreshTokenSecretKey
            );
    }

    public static async saveUser(
        user: User
        ): Promise<void> {

        try {
            await User.save(user);
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

    public static async logout(
    ): Promise<void> {
        
    }
}