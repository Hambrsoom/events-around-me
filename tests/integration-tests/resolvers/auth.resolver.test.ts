import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { gCall } from "../../test-utils/gCall";
import jwt_decode from "jwt-decode";
import { GraphQLError } from "graphql";
import { getAccessToken, registerUser } from "../../test-utils/user-helper-methods";
import { getUsernameFromJwt } from "../../../src/utilities/decoding-jwt";
import { LoginUserInput } from "../../../src/entities/user/user.entity";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
});

afterAll(async() => {
    await connection.close();
});

describe("Register Resolver", () => {
    it("create user succesffuly", async() => {
        const username: string = "koko123";
        const password: string = "koko12345";


        await registerUser(username, password);
        const accessToken: string = await getAccessToken(username, password);
        console.log(accessToken);
        const usernameFromAccessToken: string = jwt_decode(accessToken)["username"];


        expect(usernameFromAccessToken).toBe("koko123");
    });
});


describe("Login Resolver", () => {
    let user: LoginUserInput = new LoginUserInput();
    user.username = "Hampic";
    user.password = "12345678";

    const loginMutation: string =  `mutation login($user: LoginUserInput!) {
        login(user: $user){
          accessToken
          refreshToken
        }
    }`;

    it("login user successfully", async() => {
        await registerUser(user.username, user.password);

        const result: any = await gCall({
            source: loginMutation,
            variableValues: {
                user: user
            }
        });

        const usernameFromAccessToken: string = getUsernameFromJwt(result.data.login.accessToken);
        const usernameFromRefreshToken: string = getUsernameFromJwt(result.data.login.refreshToken);

        expect(usernameFromAccessToken).toBe(user.username);
        expect(usernameFromRefreshToken).toBe(user.username);
    });

    it("login user failure because the password is wrong", async() => {
        await registerUser(user.username, user.password);
        user.password = "123456783";
        console.log(user);
        const result: any = await gCall({
            source: loginMutation,
            variableValues: {
                user: user
            }
        });

        console.log(result);
        // const error: GraphQLError = result.errors[0];

        // expect(error.message).toContain("Either your username or password is incorrect");
    });

    // it("login user failure because the user doesn't exist in the database", async() => {
    //     user.username = "Hampico";
    //     const result: any = await gCall({
    //         source: loginMutation,
    //         variableValues: {
    //             user: user
    //         }
    //     });

    //     const error: GraphQLError = result.errors[0];

    //     expect(error.message).toContain("Either your username or password is incorrect");
    // });
});