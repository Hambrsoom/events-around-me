import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { User, UserInput } from "../entities/user/user.entity";
import { Role } from "../entities/user/user-role.enum";
import bcrypt from "bcrypt";
import { UserService } from "../services/user/user.service";
import { UserCashingService } from "../services/user/user-cashing.service";
import jwt_decode from "jwt-decode";

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
    @Arg("user") {username, password}: UserInput
    ): Promise<boolean> {
      let user:User = new User();
      user.username = username;
      user.password = password;
      user.role = Role.regular;

      const salt:any = await bcrypt.genSalt();
      user.salt = salt;

      user.hashPassword();

      await UserService.saveUser(user);

      return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("user") {username, password}: UserInput
    ): Promise<any> {
      const user: User = await UserService.getUserByUsernameAndPassword(username, password);

      let loginResponse: LoginResponse = {
        accessToken: UserService.getAccessToken(user.username, user.id),
        refreshToken: UserService.getRefreshToken(user.username, user.id)
      };

      await UserCashingService.addUser(loginResponse.refreshToken, user.id);

      return loginResponse;
  }

  @Mutation(() => LoginResponse)
  async getNewAccessToken(
    @Arg("refreshToken") refreshToken: string
    ): Promise<LoginResponse> {
      const userId: number = Number(jwt_decode(refreshToken)["userId"]);
      const username: string = String(jwt_decode(refreshToken)["username"]);

      if(await UserCashingService.isrefreshTokenValid(userId, refreshToken)) {
        let loginResponse: LoginResponse = {
          accessToken: UserService.getAccessToken(username, userId)
        };
        return loginResponse;
      } else {
        throw new Error("Invalid Token");
      }
  }

  @Mutation(()=> Boolean)
  async logout(
    @Arg("accessToken") accessToken: string
  ): Promise<boolean> {
    const userId: number = Number(jwt_decode(accessToken)["userId"]);
    return await UserService.logout(userId);
  }
}