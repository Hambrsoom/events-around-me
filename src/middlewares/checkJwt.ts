import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import config from "../../config/config";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}

export const checkJwt: MiddlewareFn<MyContext> = ({ context }, next) => {
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