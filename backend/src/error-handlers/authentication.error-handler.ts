import { ApolloError } from "apollo-server-errors";

export class NotAuthenticatedError extends ApolloError {
    constructor(
        message: string = "Not authenticated"
        ) {
            super(message, "UNAUTHENTICATED");

            Object.defineProperty(this, "name", { value: "AuthenticationError" });
    }
}

export class NotAuthorizedError extends ApolloError {
    constructor(
        message: string = "Not authorized"
        ) {
            super(message, "FORBIDDEN");

            Object.defineProperty(this, "name", { value: "AuthorizationError" });
    }
}


