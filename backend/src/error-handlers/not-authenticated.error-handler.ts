import BaseError from "./base-error.error.handler";

export default class NotAuthenticatedError extends BaseError {
  constructor(
    loggingMessage: string = undefined,
    message: string = "Not authenticated",
    ) {
      super(message, "UNAUTHENTICATED", "AuthenticationError", loggingMessage);
  }
}



