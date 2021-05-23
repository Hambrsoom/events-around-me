import { AuthChecker } from "type-graphql";
import { verify } from "jsonwebtoken";
import { User } from "../../entities/user/user.entity";
import { UserService } from "../../services/user/user.service";
import { Context } from "vm";
import { NotAuthenticatedError, NotAuthorizedError } from "../../error-handlers/authentication.error-handler";

const checkJwt: any =
  (authorization) => {
    if (!authorization) {
      throw new NotAuthenticatedError();
    }

    let payload: any;
    try {
      payload = verify(authorization, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new NotAuthenticatedError();
    }

    return payload;
};

export const customAuthChecker: AuthChecker<Context> = async(
  { context }, roles) => {
    context.payload = checkJwt(context.jwt);
    const user: User = await UserService.getUserByID(context.userId);
    if(roles.length > 0 && !roles.includes(user.role)) {
      throw new NotAuthorizedError();
    }

    return true;
};
