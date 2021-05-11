import { isImage } from "../../../../src/utilities/isImage";


describe("Test the isImage functionalities", () => {
    test("verify if the file type is image successfully and returns true", async() => {
        const filename: string = "Game_of_Thrones_Season_1.jpg";

        const isImageTrue: boolean = isImage(filename);

        expect(isImageTrue).toBe(true);
    });

    test("verify if the file type is not image successfully and returns false", async() => {
        const filename: string = "filename.txt";

        const isImageTrue: boolean = isImage(filename);

        expect(isImageTrue).toBe(false);
    });
});