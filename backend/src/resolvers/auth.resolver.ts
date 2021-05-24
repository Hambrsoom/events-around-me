import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserService } from "../services/user/user.service";
import LoginResponse  from "../types/login-reponse.type";
import { LoginUserInput } from "../types/login-user-input.type";
import { RegisterUserInput } from "../types/register-user-input.type";
import { getUserIdFromJwt } from "../utilities/decoding-jwt";

@Resolver()
export class AuthResolver {

  @Mutation(() => Boolean)
  public async registerRegularUser(
    @Arg("user") {username, password}: RegisterUserInput,
    ): Promise<boolean> {
      await UserService.saveUser(username, password);
      return true;
  }

  @Mutation(() => LoginResponse)
  public async login(
    @Arg("user") {username, password}: LoginUserInput,
    ): Promise<any> {
      return await UserService.login({username, password});
  }

  @Query(() => LoginResponse)
  public async getNewAccessToken(
    @Arg("refreshToken") refreshToken: string,
    ): Promise<LoginResponse> {
      return UserService.getNewAccessToken(refreshToken);
  }

  @Query(() => Boolean)
  public async isAccessTokenValid(
    @Arg("accessToken") accessToken: string,
  ) {
    return UserService.isAccessTokenValid(accessToken);
  }

  @Mutation(() => Boolean)
  public async logout(
    @Arg("accessToken") accessToken: string,
  ): Promise<boolean> {
    const userId: string = getUserIdFromJwt(accessToken);
    return await UserService.logout(userId);
  }
}
