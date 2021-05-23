import { Resolver, Mutation, Arg, ObjectType, Field, Query, Ctx } from "type-graphql";

import { LoginUserInput, RegisterUserInput } from "../entities/user/user.entity";
import { UserService } from "../services/user/user.service";
import { getUserIdFromJwt } from "../utilities/decoding-jwt";

@ObjectType()
export class LoginResponse {
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
      return await UserService.login({username, password});
  }

  @Query(() => LoginResponse)
  async getNewAccessToken(
    @Arg("refreshToken") refreshToken: string
    ): Promise<LoginResponse> {
      return UserService.getNewAccessToken(refreshToken);
  }

  @Query(() => Boolean)
  async isAccessTokenValid(
    @Arg("accessToken") accessToken: string
  ) {
    return UserService.isAccessTokenValid(accessToken);
  }

  @Mutation(()=> Boolean)
  async logout(
    @Arg("accessToken") accessToken: string
  ): Promise<boolean> {
    const userId: string = getUserIdFromJwt(accessToken);
    return await UserService.logout(userId);
  }
}