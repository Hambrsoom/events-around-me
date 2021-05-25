import { Connection } from "typeorm";
import { User } from "../../../src/entities/user/user.entity";
import { UserService } from "../../../src/services/user/user.service";
import { getUserIdFromJwt, getUsernameFromJwt } from "../../../src/utilities/decoding-jwt";
import enviromentalVariablesObject from "../../test-utils/enviromental-variables";
import { testConnection } from "../../test-utils/test-connection";
let connection: Connection;

beforeAll(async() => {
  connection = await testConnection();
  process.env = enviromentalVariablesObject;
});

afterAll(async() => {
  await connection.close();
});

describe("User Service for Tokens", () => {
  const username: string = "Hampic";
  const userId: string = "1";

  it("get AccessToken", async() => {
    const accessToken: string = UserService.getAccessToken(username, userId);

    const usernameFromAccessToken: string = getUsernameFromJwt(accessToken);
    const userIdFromAccessToken: string = getUserIdFromJwt(accessToken);

    expect(usernameFromAccessToken).toBe(username);
    expect(userIdFromAccessToken).toBe(userId);
  });

  it("get RefreshToken", async() => {
    const refreshToken: string = UserService.getRefreshToken(username, userId);

    const usernameFromAccessToken: string = getUsernameFromJwt(refreshToken);
    const userIdFromAccessToken: string = getUserIdFromJwt(refreshToken);

    expect(usernameFromAccessToken).toBe(username);
    expect(userIdFromAccessToken).toBe(userId);
  });
});

describe("user service for saving users", () => {
  it("save a user successfully", async() => {
    const username: string = "Ham123";
    const password: string = "Ham12345678";

    const returnedUser: User = await UserService.saveUser(username, password);

    expect(returnedUser.username).toBe(username);
  });

  it("save a user failure for duplicated usernames", async() => {
    const username: string = "Hampic";
    const password: string = "12345678";

    try {
        await UserService.saveUser(username, password);
    } catch (err) {
        expect(err.message).toBe("Failed in storing the user in the database");
    }
  });
});


describe("user service for getting user by Id", () => {
  it("get a user with id=1 successfully", async() => {
    const userId: string = "1";

    const user: User = await UserService.getUserByID(userId);

    expect(user.username).toBeDefined();
  });

  it("get a user with id=1789 Failure", async() => {
    const userId: string = "1789";

    try {
        await UserService.getUserByID(userId);
    } catch (err) {
        expect(err.message).toBe(`Could not find the user with id ${userId}`);
    }
  });
});
