import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";

import { User, LoginUserInput, RegisterUserInput } from "../entities/user/user.entity";
import { UserService } from "../services/user/user.service";
import { UserCashingService } from "../services/user/user-cashing.service";
import { getUserIdFromJwt, getUsernameFromJwt } from "../utilities/decoding-jwt";
import { ErrorMessage } from "../utilities/error-message";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken?: string;

  @Field()
  refreshToken?: string;
}

@Resolver()
export class AuthResolver {

  @Mutation(() => Boolean)
  async registerRegularUser(
    @Arg("user") {username, password}: RegisterUserInput
    ): Promise<boolean> {
      await UserService.saveUser(username, password);
      return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("user") {username, password}: LoginUserInput
    ): Promise<any> {
      const user: User = await UserService.getUserByUsernameAndPassword(username, password);

      let loginResponse: LoginResponse = {
        accessToken: UserService.getAccessToken(user.username, user.id),
        refreshToken: UserService.getRefreshToken(user.username, user.id)
      };

      UserService.storeUserInfoInCache(loginResponse.refreshToken, user.id);

      return loginResponse;
  }

  @Mutation(() => LoginResponse)
  async getNewAccessToken(
    @Arg("refreshToken") refreshToken: string
    ): Promise<LoginResponse> {

      const userId: string = getUserIdFromJwt(refreshToken);
      const username: string = getUsernameFromJwt(refreshToken);

      if(await UserCashingService.isrefreshTokenValid(userId, refreshToken)) {
        let loginResponse: LoginResponse = {
          accessToken: UserService.getAccessToken(username, userId)
        };
        return loginResponse;
      } else {
        ErrorMessage.notAutherizedErrorMessage();
      }
  }

  @Mutation(()=> Boolean)
  async logout(
    @Arg("accessToken") accessToken: string
  ): Promise<boolean> {
    const userId: string = getUserIdFromJwt(accessToken);;
    return await UserService.logout(userId);
  }
}