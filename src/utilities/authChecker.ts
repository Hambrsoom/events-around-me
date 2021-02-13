import { AuthChecker } from "type-graphql";
import { verify } from "jsonwebtoken";
import config from "../../config/config";
import { IContext } from "../types/context";
import { User } from '../entities/user.entity';


export const customAuthChecker: AuthChecker<IContext> = async(
  { context }, roles) => {
    const autherization =  context.req.headers["authorization"];
    context.payload = checkJwt(autherization);
    const decodedUserID =  checkJwt(autherization)["userId"];
    const user: User = await User.findOne({ where: {id: decodedUserID}});
  
    if(roles.length > 0 && !roles.includes(user.role)){
      throw new Error("Not Authorized");
    }
    return true; 
};


const checkJwt: any = 
  (authorization) => {
    if (!authorization) {
      throw new Error("Not authenticated");
    }

    let payload: any;
    try {
      payload = verify(authorization, config.accessTokenSecretKey);
    } catch (err) {
      throw new Error("Not authenticated");
    }
      return payload as any;
};