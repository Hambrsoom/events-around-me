import BaseError from "./base-error.error.handler";

export default class UserInputError extends BaseError {
  constructor(
    loggingMessage: string = undefined,
    message: string = "Not valid input",
    ) {
      super(message, "BAD_USER_INPUT", "UserInputError", loggingMessage);
  }
}
