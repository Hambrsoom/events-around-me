import BaseError from "./base-error.error.handler";

export default class PersistenceError extends BaseError {
  constructor(
    type: string,
    loggingMessage: string = undefined,
    message: string = `Failed in storing the ${type} in the database`,
    ) {
      super(message, "FAILED_TO_STORE", "FailedToStore", loggingMessage);
  }
}
