import { ErrorMessage } from "../../../../src/utilities/error-message";
import { isImage } from "../../../../src/utilities/isImage";


describe("Test the error-message functionalities", () => {
    test("forbiddendErrorForOwnership", async() => {
        const type: string = "organization";
        const id: string = "1";
        try {
            ErrorMessage.forbiddenErrorForOwnership(id, type);
        } catch(err) {
            expect(err.message).toBe(`User is not the owner of the ${type} with ${id}`);
        }
    });

    test("userInputErrorMessage", async() => {
        const message: string = "Wrong Input";
        try {
            ErrorMessage.userInputErrorMessage(message);
        } catch(err) {
            expect(err.message).toBe(message);
        }
    });

    test("notAuthenticatedErrorMessage", async() => {
        try {
            ErrorMessage.notAuthenticatedErrorMessage();
        } catch(err) {
            expect(err.message).toBe("Must authenticate");
        }
    });

    test("notAutherizedErrorMessage", async() => {
        try {
            ErrorMessage.notAutherizedErrorMessage();
        } catch(err) {
            expect(err.message).toBe("Not authorized");
        }
    });

    test("notFoundErrorMessage", async() => {
        const type: string = "organization";
        const id: string = "1";
        try {
            ErrorMessage.notFoundErrorMessage(id, type);
        } catch(err) {
            expect(err.message).toBe(`Could not find the ${type} with id ${id}`);
        }
    });

    test("failedToStoreErrorMessage", async() => {
        const type: string = "organization";
        try {
            ErrorMessage.failedToStoreErrorMessage(type);
        } catch(err) {
            expect(err.message).toBe(`Failed in storing the ${type} in the database`);
        }
    });
});