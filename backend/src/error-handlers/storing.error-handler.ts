import { ApolloError } from "apollo-server-express";

export class StoringError extends ApolloError {
    constructor(
        type: string,
        message: string = `Failed in storing the ${type} in the database`
        ) {
            super(message, "FAILED_TO_STORE" );

            Object.defineProperty(this, "name", { value: "FailedToStore" });
    }
}