import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { sign } from "jsonwebtoken";
import { Role, User, UserInput } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import config from "../../config/config";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}
  
@Resolver()
export class AuthResolver {  
  @Mutation(() => Boolean)
  async Register(@Arg("user") userInput: UserInput) {
    let user:User = new User();
    user.username = userInput.username;
    user.password = userInput.password;
    user.role = Role.regular;

    const salt:any = await bcrypt.genSalt();
    user.salt = salt;

    user.hashPassword();

    try {
      await User.insert(user);
    } catch (err) {
      throw new Error("Failed in storing the user");
    }
  
    return true;
  }
  
  @Mutation(() => LoginResponse)
  async Login(
    @Arg("username") username: string, 
    @Arg("password") password: string) {
      
    const user = await User.findOne({ where: { username } });
      
    if (!user) {
      throw new Error("Could not find user");
    }
    
    const isPasswordValid: boolean = await user.validatePassword(password)
    if (!isPasswordValid) {
      throw new Error("Either your username or password is incorrect");
    }

    return {
      accessToken: sign(
        { userId: user.id, username: user.username },
        config.jwtSecret, 
        { expiresIn: "1h"}
      )
    };
  }
}