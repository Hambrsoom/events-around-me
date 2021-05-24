import BaseError from "./base-error.error.handler";

export default class OwnershipError extends BaseError {
  constructor(
    id: string,
    type: string,
    loggingMessage: string = undefined,
    message: string = `User is not the owner of the ${type} with ${id}`,
    ) {
      super(message, "FORBIDDEN", "ForbiddenError", loggingMessage);
  }
}

