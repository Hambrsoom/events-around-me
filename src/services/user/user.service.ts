import { sign } from "jsonwebtoken";
import { User } from "../../entities/user/user.entity";
import config from "../../../config/config";
import { UserCashingService } from "./user-cashing.service";
import { Role } from "../../entities/user/user-role.enum";
import bcrypt from "bcrypt";
import { ErrorMessage } from "../../utilities/error-message";
import { UserInputError } from "apollo-server-express";

export class UserService {
    public static getAccessToken(
        username: string,
        userId: string
        ): string {
            return sign(
                  { userId: userId, username: username },
                  config.accessTokenSecretKey,
                  { expiresIn: "1h"}
            );
    }

    public static getRefreshToken(
        username: string,
        userId: string
        ): string {
            return sign(
                  { userId: userId, username: username },
                  config.refreshTokenSecretKey
            );
    }

    public static async saveUser(
        username: string,
        password: string
        ): Promise<User> {
            let user:User = new User();
            user.username = username;
            user.password = password;
            user.role = Role.regular;

            const salt:any = await bcrypt.genSalt();
            user.salt = salt;

            user.hashPassword();

            try {
                return await User.save(user);
            } catch (err) {
                ErrorMessage.failedToStoreErrorMessage("user");
            }
    }

    public static async getUserByID(
        userId: string
        ): Promise<User> {
            try {
                return await User.findOneOrFail(userId, {
                    relations: ["organization"]
                });
            } catch(err) {
                ErrorMessage.notFoundErrorMessage(userId, "user");
            }
    }

    public static async getUserByUsernameAndPassword(
        username: string,
        password: string
        ): Promise<User> {
            const user: User = await User.findOne({ where: { username } });

            if (!user) {
                UserService.loginErrorMessage();
            }

            UserService.isPasswordValid(user, password);

            return user;
    }

    public static async storeUserInfoInCache(
        refreshToken: string,
        userId: string
        ): Promise<void> {
            await UserCashingService.addUser(refreshToken, userId);
    }

    public static async isPasswordValid(
        user: User,
        password: string
        ): Promise<boolean> {
            const isPasswordValid: boolean = await user.validatePassword(password);
            if (!isPasswordValid) {
                UserService.loginErrorMessage();
            } else {
                return true;
            }
    }

    public static async logout(
        userId: string
        ): Promise<boolean> {
            if(await UserCashingService.isUserExist(userId) !== 0) {
                return await UserCashingService.removeUser(userId);
            } else {
                ErrorMessage.notAuthenticatedErrorMessage();
            }
    }

    public static loginErrorMessage(
        ): void {
            throw new UserInputError("Either your username or password is incorrect");
    }
}