import { ApolloError } from "apollo-server-express";

export class UserInputError extends ApolloError {
    constructor(
        message: string = "Not valid input"
        ) {
            super(message, "BAD_USER_INPUT");

            Object.defineProperty(this, "name", { value: "UserInputError" });
    }
}