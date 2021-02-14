import { Connection } from "typeorm";
import { testConn } from "../test-utils/testConn";
import { gCall } from "../test-utils/gCall";
import jwt_decode from "jwt-decode";
import { GraphQLError } from "graphql";
import { getAccessToken, registerUser } from "../test-utils/user-helper-methods";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
    await registerUser("Hampic", "12345678");
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

        expect(usernameFromAccessToken).toBe("koko123");
    });
});

describe("Login Resolver", () => {
    const loginMutation: string = `mutation login($password:String! , $username: String!){
        login(password:$password, username:$username){
          accessToken
          refreshToken
        }
    }`;

    it("login user successfully", async() => {
        const result: any = await gCall({
            source: loginMutation,
            variableValues: {
                username: "Hampic",
                password: "12345678"
            }
        });
        const usernameFromAccessToken: string = jwt_decode(result.data.login.accessToken)["username"];
        const usernameFromRefreshToken: string = jwt_decode(result.data.login.refreshToken)["username"];

        expect(usernameFromAccessToken).toBe("Hampic");
        expect(usernameFromRefreshToken).toBe("Hampic");
    });

    it("login user failure because the password is wrong", async() => {
        const result: any = await gCall({
            source: loginMutation,
            variableValues: {
                username: "Hampic",
                password: "123456783"
            }
        });

        const error: GraphQLError = result.errors[0];

        expect(error.message).toContain("Either your username or password is incorrect");
    });

    it("login user failure because the user doesn't exist in the database", async() => {
        const result: any = await gCall({
            source: loginMutation,
            variableValues: {
                username: "Hampico",
                password: "123456783"
            }
        });

        const error: GraphQLError = result.errors[0];

        expect(error.message).toContain("Either your username or password is incorrect");
    });
});