import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    Field,
    UseMiddleware,
    Ctx
  } from "type-graphql";
  import { sign } from "jsonwebtoken";
  import { hash, compare, salt } from "bcryptjs";
  import { User } from "../entities/user.entity";
  import { checkJwt } from "../middlewares/checkJwt";
  import { Context } from "../entities/context";
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
    async Register(
      @Arg("username") username: string,
      @Arg("password") password: string
    ) {
    
        let user:User = new User();
        user.username = username;
        user.password = password;

    const salt:any = await bcrypt.genSalt();
    user.salt = salt;

    // hash the password, to securely store on DB
    user.hashPassword();

      try {
        await User.insert(user);
      } catch (err) {
        console.log(err);
        return false;
      }
  
      return true;
    }
  
    @Mutation(() => LoginResponse)
    async Login(
        @Arg("username") username: string, 
        @Arg("password") password: string)  {
      
      
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
          { 
            userId: user.id,
            username: user.username }, config.jwtSecret, {
          expiresIn: "1h"
        })
      };
    }
  }