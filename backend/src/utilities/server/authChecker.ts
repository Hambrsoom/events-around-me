import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { Context } from "vm";
import { User } from "../../entities/user/user.entity";
import  NotAuthenticatedError  from "../../error-handlers/not-authenticated.error-handler";
import  NotAuthorizedError  from "../../error-handlers/not-authorized.error-handler";
import { UserService } from "../../services/user/user.service";

const checkJwt: any =
  (authorization) => {
    if (!authorization) {
      throw new NotAuthenticatedError();
    }

    let payload: any;
    try {
      payload = verify(authorization, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new NotAuthenticatedError(err.message);
    }

    return payload;
};

export const customAuthChecker: AuthChecker<Context> = async(
  { context }, roles) => {
    context.payload = checkJwt(context.jwt);
    const user: User = await UserService.getUserByID(context.userId);
    if (roles.length > 0 && !roles.includes(user.role)) {
      throw new NotAuthorizedError();
    }

    return true;
};
