import { ApolloError } from "apollo-server-errors";

export class ForbiddenForOwnershipError extends ApolloError {
    constructor(
        id: string,
        type: string,
        message: string = `User is not the owner of the ${type} with ${id}`
        ) {
            super(message, "FORBIDDEN");

            Object.defineProperty(this, "name", { value: "ForbiddenError" });
    }
}

