import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { Role, User, UserInput } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import { UserService } from "../services/user.service";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
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

    return true;
  }
  
  @Mutation(() => LoginResponse)
  async login(
    @Arg("username") username: string, 
    @Arg("password") password: string
    ): Promise<any> {
      
    const user = await User.findOne({ where: { username } });
      
    if (!user) {
      throw new Error("Could not find user");
    }
    
    const isPasswordValid: boolean = await user.validatePassword(password)
    if (!isPasswordValid) {
      throw new Error("Either your username or password is incorrect");
    }

    return UserService.getJwt(user.username, user.id)
  }
}