import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/context";
import jwt_decode from "jwt-decode";
import { User, Role } from "../entities/user.entity";

export const isOrganizer: MiddlewareFn<Context> = async ({ context }, next) => {
  const decoded = jwt_decode(context.req.headers["authorization"]);

  let user: User = new User();
    try {
        user = await User.findOneOrFail({ 
            where:{ id: decoded['userId'] }
        })
    }catch(err){
        throw new Error("User doesn't exist");
    }

    if (user.role == Role.organizer){
        return next();
    } else {
        throw new Error("User doesn't have permission to this method");
    }
};