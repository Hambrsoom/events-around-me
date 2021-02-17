import { ForbiddenError, UserInputError, AuthenticationError } from "apollo-server-express";

export class ErrorMessage {
    public static forbiddenErrorForOwnership(
        id: string,
        type: string
    ): void {
        throw new ForbiddenError(`User is not the owner of the ${type} with ${id}`);
    }

    public static userInputErrorMessage(
        message: string
    ): void {
        throw new UserInputError(message);
    }

    public static notAuthenticatedErrorMessage(
    ): void {
        throw new AuthenticationError("Must authenticate");
    }

    public static notAutherizedErrorMessage(
    ): void {
        throw new ForbiddenError("Not authorized");
    }

    public static notFoundErrorMessage(
        id: string,
        type: string
    ): void {
        throw new Error(`Could not find a ${type} with id ${id}`);
    }

    public static failedToStoreErrorMessage(
        type: string
    ): void {
        throw new Error(`Failed in storing the ${type} in the database`)
    }
}
