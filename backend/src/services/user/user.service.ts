import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { Role } from "../../entities/user/user-role.enum";
import { User } from "../../entities/user/user.entity";
import NotAuthenticatedError  from "../../error-handlers/not-authenticated.error-handler";
import NotAuthorizedError from "../../error-handlers/not-authorized.error-handler";
import NotFoundError from "../../error-handlers/not-found.error-handler";
import StoringError  from "../../error-handlers/persistence-error.error-handler";
import UserInputError  from "../../error-handlers/user-input.error-handler";
import LoginResponse from "../../types/login-reponse.type";
import { LoginUserInput } from "../../types/login-user-input.type";
import { getUserIdFromJwt, getUsernameFromJwt } from "../../utilities/decoding-jwt";
import { UserCashingService } from "./user-cashing.service";

export class UserService {
    public static async login(
        loginUserInput: LoginUserInput,
        ): Promise<LoginResponse> {
            const user: User = await UserService.getUserByUsernameAndPassword(loginUserInput.username, loginUserInput.password);

            let loginResponse: LoginResponse = {
                accessToken: UserService.getAccessToken(user.username, user.id),
                refreshToken: UserService.getRefreshToken(user.username, user.id),
            };

            UserService.storeUserInfoInCache(loginResponse.refreshToken, user.id);

            return loginResponse;
    }

    public static getAccessToken(
        username: string,
        userId: string,
        ): string {
            return sign(
                  { userId, username },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: "1h"},
            );
    }

    public static getRefreshToken(
        username: string,
        userId: string,
        ): string {
            return sign(
                  { userId, username },
                  process.env.REFRESH_TOKEN_SECRET,
            );
    }

    public static isAccessTokenValid(token: string): boolean {
        verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );
        return true;
    }


    public static async getNewAccessToken(
        refreshToken: string,
        ): Promise<LoginResponse> {
            const userId: string = getUserIdFromJwt(refreshToken);
            const username: string = getUsernameFromJwt(refreshToken);

            if (await UserCashingService.isrefreshTokenValid(userId, refreshToken)) {
                let loginResponse: LoginResponse = {
                    accessToken: UserService.getAccessToken(username, userId),
                };
                return loginResponse;
            } else {
                throw new NotAuthorizedError();
            }
    }

    public static async saveUser(
        username: string,
        password: string,
        role: Role = Role.regular,
        ): Promise<User> {
            try {
                const user: User = await User.create({
                    username,
                    password,
                    role,
                }).save();

                return user;
            } catch (err) {
                throw new StoringError("user");
            }
    }

    public static async getUserByID(
        userId: string,
        ): Promise<User> {
            try {
                return await User.findOneOrFail(userId, {
                    relations: ["organization"],
                });
            } catch (err) {
                throw new NotFoundError(userId, "user");
            }
    }

    public static async getUserByUsernameAndPassword(
        username: string,
        password: string,
        ): Promise<User> {
            try {
                const user: User = await User.findOneOrFail({
                     where: { username },
                });
                UserService.isPasswordValid(user, password);
                return user;
            } catch (error) {
                UserService.loginErrorMessage();
            }
    }

    public static async storeUserInfoInCache(
        refreshToken: string,
        userId: string,
        ): Promise<void> {
            await UserCashingService.addUser(refreshToken, userId);
    }

    public static async isPasswordValid(
        user: User,
        password: string,
        ): Promise<boolean> {
            const isPasswordValid: boolean = await user.validatePassword(password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                UserService.loginErrorMessage();
            } else {
                return true;
            }
    }

    public static async logout(
        userId: string,
        ): Promise<boolean> {
            if (await UserCashingService.isUserExist(userId) !== 0) {
                return await UserCashingService.removeUser(userId);
            } else {
                throw new NotAuthenticatedError();
            }
    }

    public static loginErrorMessage(
        ): void {
            throw new UserInputError("Either your username or password is incorrect");
    }
}
