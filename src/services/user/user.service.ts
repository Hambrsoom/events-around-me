import { sign } from "jsonwebtoken";
import { User } from "../../entities/user/user.entity";
import config from "../../../config/config";
import { UserCashingService } from "./user-cashing.service";

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

    public static async getUserByUsernameAndPassword(
        username: string,
        password: string
        ): Promise<User> {
            const user: User = await User.findOne({ where: { username } });

            if (!user) {
                throw new Error("Either your username or password is incorrect");
            }

            UserService.isPasswordValid(user, password);

            return user;
    }

    public static async isPasswordValid(
        user: User,
        password: string
        ): Promise<boolean> {
            const isPasswordValid: boolean = await user.validatePassword(password);
            if (!isPasswordValid) {
                throw new Error("Either your username or password is incorrect");
            } else {
                return true;
            }
    }

    public static async logout(
        userId: number
        ): Promise<boolean> {
            if(await UserCashingService.isUserExist(userId) !== 0) {
                return await UserCashingService.removeUser(userId);
            } else {
                throw new Error("The token is invalid. Please try to login first");
            }
    }
}