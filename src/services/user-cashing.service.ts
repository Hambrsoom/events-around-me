import { promisify } from "util";
import { redisClient } from "../redis-connection";

interface IUserToken {
    userId: number;
    refreshToken: string;
}

export class UserCashingService {
    public static async getUsers()
    : Promise<Map<number,string>> {

        const getAsync: any = promisify(redisClient.get).bind(redisClient);
        const users: string = await getAsync("users");
        return users? JSON.parse(users): {};
    }

    public static async addUser(
        refreshToken: string,
        userId: number
        ): Promise<void> {

        let users: Map<number,string> = await UserCashingService.getUsers();

        users[userId] = refreshToken;

        const setAsync: any = promisify(redisClient.set).bind(redisClient);
        await setAsync("users", JSON.stringify(users));
    }

    public static async removeUser(
        userId: number
    ): Promise<boolean> {
        let users: Map<number,string> = await UserCashingService.getUsers();

        try {
            users.delete(userId);

            const setAsync: any = promisify(redisClient.set).bind(redisClient);
            await setAsync("users", JSON.stringify(users));
            return true;
        } catch (err) {
            throw new Error("User is not logged in");
        }
    }
}