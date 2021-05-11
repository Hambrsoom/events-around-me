import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { callResolver } from "../../test-utils/resolver-caller";
import jwt_decode from "jwt-decode";
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
        const usernameFromAccessToken: string = jwt_decode(accessToken)["username"];

        expect(usernameFromAccessToken).toBe(username);
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

        const result: any = await callResolver({
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

        try {
            await callResolver({
                source: loginMutation,
                variableValues: {
                    user: user
                }
            });

        } catch(err) {
            expect(err).toThrow("Either your username or password is incorrect");
        }
    });
});