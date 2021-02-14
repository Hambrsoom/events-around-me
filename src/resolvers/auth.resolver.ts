import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { Role, User, UserInput } from "../entities/user.entity";
import bcrypt from "bcrypt";
import { UserService } from "../services/user.service";
import { UserCashingService } from "../services/user-cashing.service";
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
  async register(
    @Arg("user") userInput: UserInput
    ): Promise<boolean> {

    let user:User = new User();
    user.username = userInput.username;
    user.password = userInput.password;
    user.role = Role.regular;

    const salt:any = await bcrypt.genSalt();
    user.salt = salt;

    user.hashPassword();

    await UserService.saveUser(user);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
    ): Promise<any> {

    const user: User = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("Either your username or password is incorrect");
    }

    const isPasswordValid: boolean = await user.validatePassword(password)
    if (!(user && isPasswordValid)) {
      throw new Error("Either your username or password is incorrect");
    }

    let loginResponse: LoginResponse = {
      accessToken: UserService.getAccessToken(user.username, user.id),
      refreshToken: UserService.getRefreshToken(user.username, user.id)
    };

    try {
      await UserCashingService.addUser(loginResponse.refreshToken, user.id);
    } catch(err) {
      loginResponse.accessToken = "";
      loginResponse.refreshToken = "";
      return loginResponse;
    }

    return loginResponse;
  }



  @Mutation(() => LoginResponse)
  async getNewAccessToken(
    @Arg("refreshToken") refreshToken: string
    ): Promise<string> {
      const userId: number = Number(jwt_decode(refreshToken)["userId"]);
      const username: string = String(jwt_decode(refreshToken)["username"]);
      console.log(userId);
      console.log(username);

      return UserService.getAccessToken(username, userId);
  }

  // @Mutation(()=> Boolean)
  // async logout(
  //   @Arg("accessToken") accessToken: string
  // ): Promise<boolean> {
  //   const userId: number = Number(jwt_decode(accessToken)["userId"]);
  //   UserService.logout(userId);
  // }
}