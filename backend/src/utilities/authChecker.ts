import { AuthChecker } from "type-graphql";
import { verify } from "jsonwebtoken";
import { User } from "../entities/user/user.entity";
import { ErrorMessage } from "./error-message";
import { UserService } from "../services/user/user.service";
import { Context } from "vm";

const checkJwt: any =
  (authorization) => {
    if (!authorization) {
      ErrorMessage.notAuthenticatedErrorMessage();
    }

    let payload: any;
    try {
      payload = verify(authorization, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      ErrorMessage.notAuthenticatedErrorMessage();
    }

    return payload;
};

export const customAuthChecker: AuthChecker<Context> = async(
  { context }, roles) => {
    context.payload = checkJwt(context.jwt);
    const user: User = await UserService.getUserByID(context.userId);
    if(roles.length > 0 && !roles.includes(user.role)) {
      ErrorMessage.notAutherizedErrorMessage();
    }

    return true;
};
