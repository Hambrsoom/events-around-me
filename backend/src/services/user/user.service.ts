import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import { Role } from "../../entities/user/user-role.enum";
import { User } from "../../entities/user/user.entity";
import NotAuthenticatedError  from "../../error-handlers/not-authenticated.error-handler";
import NotAuthorizedError from "../../error-handlers/not-authorized.error-handler";
import UserInputError  from "../../error-handlers/user-input.error-handler";
import { UserRepository } from "../../repositories/user.repository";
import LoginResponse from "../../types/login-reponse.type";
import { LoginUserInput } from "../../types/login-user-input.type";
import { getUserIdFromJwt, getUsernameFromJwt } from "../../utilities/decoding-jwt";
import { UserCachingService } from "./user-caching.service";

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

  public static isAccessTokenValid(
    token: string,
    ): boolean {
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

      if (await UserCachingService.isRefreshTokenValidInCache(userId, refreshToken)) {
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
      const userRepository = getCustomRepository(UserRepository);
      return await userRepository.saveUser(
        username,
        password,
        role);
  }

  public static async getUserByID(
    userId: string,
    ): Promise<User> {
      const userRepository = getCustomRepository(UserRepository);
      return userRepository.findUser(userId);
  }

  public static async getUserByUsernameAndPassword(
    username: string,
    password: string,
    ): Promise<User> {
      try {
        const userRepository = getCustomRepository(UserRepository);
        const user: User = await userRepository.findOneOrFail({
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
      await UserCachingService.cachingUser(refreshToken, userId);
  }

  public static async isPasswordValid(
    user: User,
    password: string,
    ): Promise<boolean> {
      const isPasswordValid: boolean = await user.validatePassword(password);
      if (!isPasswordValid) {
        UserService.loginErrorMessage();
      } else {
        return true;
      }
  }

  public static async logout(
    userId: string,
    ): Promise<boolean> {
      if (await UserCachingService.isUserIdCached(userId) !== 0) {
        return await UserCachingService.removeUserFromCache(userId);
      } else {
        throw new NotAuthenticatedError();
      }
  }

  public static loginErrorMessage(
    ): void {
      throw new UserInputError("Either your username or password is incorrect");
  }
}
