import BaseError from "./base-error.error.handler";

export default class NotAuthorizedError extends BaseError {
  constructor(
    loggingMessage: string = undefined,
    message: string = "Not authorized",
    ) {
      super(message, "FORBIDDEN", "AuthorizationError", loggingMessage);
  }
}
