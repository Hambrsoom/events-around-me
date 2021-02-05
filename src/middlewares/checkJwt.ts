import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import config from "../../config/config";
import { Context } from "../types/context";


export const checkJwt: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const payload = verify(authorization, config.jwtSecret);
    context.payload = payload as any;
  } catch (err) {
    throw new Error("Not authenticated");
  }
  return next();
};