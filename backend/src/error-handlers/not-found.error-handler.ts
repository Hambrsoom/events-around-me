import { ApolloError } from "apollo-server-express";

export class NotFoundError extends ApolloError {
    constructor(
        id: string,
        type: string,
        message: string = `Could not find the ${type} with id ${id}`
        ) {
            super(message, "NOT_FOUND" );

            Object.defineProperty(this, "name", { value: "NotFoundError" });
    }
}