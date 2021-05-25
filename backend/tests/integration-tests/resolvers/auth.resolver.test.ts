import jwt_decode from "jwt-decode";
import "reflect-metadata";
import { Connection } from "typeorm";
import { LoginUserInput } from "../../../src/types/login-user-input.type";
import { getUsernameFromJwt } from "../../../src/utilities/decoding-jwt";
import enviromentalVariablesObject from "../../test-utils/enviromental-variables";
import { callResolver } from "../../test-utils/resolver-caller";
import { testConnection } from "../../test-utils/test-connection";
import { getAccessToken, registerUser } from "../../test-utils/user-helper-methods";

let connection: Connection;

beforeAll(async() => {
  connection = await testConnection();
  process.env = enviromentalVariablesObject;
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
        user,
      },
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
          user,
        },
      });

    } catch (err) {
      expect(err).toThrow("Either your username or password is incorrect");
    }
  });
});
