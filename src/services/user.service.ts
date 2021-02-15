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
        ): Promise<User> {

        try {
            return await User.save(user);
        } catch (err) {
            throw new Error("Failed in storing the user since the user already exists in the database");
        }
    }

    public static async getUserByID(
        userId: number
        ): Promise<User> {

        try {
            return await User.findOneOrFail(userId, {
                relations: ["organization"]
            });
        } catch(err) {
            throw new Error(`Could not find a user with id ${userId}`);
        }
    }

}