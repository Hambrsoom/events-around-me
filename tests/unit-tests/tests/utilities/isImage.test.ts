import { isImage } from "../../../../src/utilities/isImage";


describe("Test the isImage functionalities", () => {
    test("verify if the file type is image successfully and returns true", async() => {
        // given
        const filename: string = "Game_of_Thrones_Season_1.jpg";

        // when
        const isImageTrue: boolean = isImage(filename);

        // then
        expect(isImageTrue).toBe(true);
    });

    test("verify if the file type is not image successfully and returns false", async() => {
        // given
        const filename: string = "filename.txt";

        // when
        const isImageTrue: boolean = isImage(filename);

        // then
        expect(isImageTrue).toBe(false);
    });
});