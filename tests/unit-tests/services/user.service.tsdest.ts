import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import jwt_decode from "jwt-decode";
import { registerUser } from "../../test-utils/user-helper-methods";
import { UserService } from "../../../src/services/user.service";
import { User } from "../../../src/entities/user/user.entity";
import { Role } from "../../../src/entities/user/user-role.enum";
import bcrypt from "bcrypt";

let connection: Connection;

beforeAll(async() => {
    connection = await testConn();
    await registerUser("Hampic", "12345678");
});

afterAll(async() => {
    await connection.close();
});

describe("User Service for Tokens", () => {
    const username: string = "koko123";
    const userId: number = 1;

    it("get AccessToken", async() => {
        const accessToken: string = UserService.getAccessToken(username, userId);

        const usernameFromAccessToken: string = jwt_decode(accessToken)["username"];
        const userIdFromAccessToken: string = jwt_decode(accessToken)["userId"];

        expect(usernameFromAccessToken).toBe(username);
        expect(userIdFromAccessToken).toBe(userId);
    });

    it("get RefreshToken", async() => {
        const refreshToken: string = UserService.getRefreshToken(username, userId);

        const usernameFromAccessToken: string = jwt_decode(refreshToken)["username"];
        const userIdFromAccessToken: string = jwt_decode(refreshToken)["userId"];

        expect(usernameFromAccessToken).toBe(username);
        expect(userIdFromAccessToken).toBe(userId);
    });
});

describe("user service for saving users", () => {
    const user: User = new User();

    it("save a user successfully", async() => {
        user.username = "Ham123";
        user.password = "Ham12345678";
        user.role = Role.admin;
        const salt:any = await bcrypt.genSalt();
        user.salt = salt;
    
        user.hashPassword();

        const returnedUser: User = await UserService.saveUser(user);


        expect(returnedUser).toBe(user);
    });

    it("save a user failure for duplicated usernames", async() => {
        user.username = "Hampic";
        user.password = "12345678";
        user.role = Role.regular;
        const salt:any = await bcrypt.genSalt();
        user.salt = salt;
        user.hashPassword();

        try {
            await UserService.saveUser(user)
        } catch(err) {
            expect(err.message).toBe("Failed in storing the user since the user already exists in the database");
        }
    });
});


describe("user service for getting user by Id", () => {
    it("get a user with id=1 successfully", async() => {
        const userId: number = 1;

        const user: User = await UserService.getUserByID(userId);

        expect(user.username).toBe("Hampic");
    });

    it("get a user with id=1789 Failure", async() => {
        const userId: number = 1789;

        try {
            await UserService.getUserByID(userId);
        } catch(err) {
            expect(err.message).toBe(`Could not find a user with id ${userId}`);
        }
    });
});
