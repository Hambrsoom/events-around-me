import { ResolverData } from "type-graphql";
import { Role } from "../../../../src/entities/user.entity";
import { IContext } from "../../../../src/types/context";
import { customAuthChecker } from "../../../../src/utilities/authChecker";
import { isImage } from "../../../../src/utilities/isImage";


describe("Test the authChecker functionalities", () => {
    test("verify if a user is authorized to login", async() => {
        // given
        // const jwtCode: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiSGFtcGljIiwiaWF0IjoxNjEzMTg5NTI3LCJleHAiOjE2MTMxODk1Mzd9.yYWBEd-Uj-oRnJDOTrFxl5qQ8dybbyphvbEFysba0J4";
        // const context: ResolverData<IContext>= {
                
        // }

        // const roles = [ Role.admin, Role.organizer, Role.regular];

        // customAuthChecker(context, roles)


    });
});