import { UserInputError } from "apollo-server-errors";
import NotAuthenticatedError from "../../../src/error-handlers/not-authenticated.error-handler";
import NotAuthorizedError from "../../../src/error-handlers/not-authorized.error-handler";
import NotFoundError from "../../../src/error-handlers/not-found.error-handler";
import OwnershipError from "../../../src/error-handlers/ownership.error-handler";
import PersistenceError from "../../../src/error-handlers/persistence-error.error-handler";

describe("Test the error-handler classes", () => {
  test("OwnershipError", async() => {
    const type: string = "organization";
    const id: string = "1";
    try {
      throw new OwnershipError(id, type);
    } catch (err) {
      expect(err.message).toBe(`User is not the owner of the ${type} with ${id}`);
    }
  });

  test("UserInputError", async() => {
    const message: string = "Wrong Input";
    try {
      throw new UserInputError(message);
    } catch (err) {
      expect(err.message).toBe(message);
    }
  });

  test("NotAuthenticatedError", async() => {
    try {
      throw new NotAuthenticatedError();
    } catch (err) {
      expect(err.message).toBe("Not authenticated");
    }
  });

  test("NotAuthorizedError", async() => {
    try {
      throw new NotAuthorizedError();
    } catch (err) {
      expect(err.message).toBe("Not authorized");
    }
  });

  test("NotFoundError", async() => {
    const type: string = "organization";
    const id: string = "1";
    try {
      throw new NotFoundError(id, type);
    } catch (err) {
      expect(err.message).toBe(`Could not find the ${type} with id ${id}`);
    }
  });

  test("PersistenceError", async() => {
    const type: string = "organization";
    try {
        throw new PersistenceError(type);
    } catch(err) {
        expect(err.message).toBe(`Failed in storing the ${type} in the database`);
    }
  });
});
