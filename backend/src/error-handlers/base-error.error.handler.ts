import { ApolloError } from "apollo-server-errors";
import logger from "../utilities/logger/logger";
import loggingLevels from "../utilities/logger/logging-level";

export default class BaseError extends ApolloError {
  constructor(
    message: string,
    errorCode: string,
    errorType: string,
    loggingMessage: string = undefined,
    ) {
      super(message, errorCode);

      if (loggingMessage) {
        logger.error({
            level : loggingLevels.error,
            message: loggingMessage,
        });
      }

      Object.defineProperty(this, "name", { value: errorType });
  }
}
