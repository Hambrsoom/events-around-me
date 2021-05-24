import BaseError from "./base-error.error.handler";

export default class NotFoundError extends BaseError {
  constructor(
    id: string,
    type: string,
    loggingMessage: string = undefined,
    message: string = `Could not find the ${type} with id ${id}`,
    ) {
      super(message, "NOT_FOUND", "NotFoundError", loggingMessage);
  }
}
