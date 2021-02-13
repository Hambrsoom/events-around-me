import { promisify } from "util";
import { redisClient } from "../server";

interface IUserToken {
    userId: number;
    refreshToken: string;
}

export class UserCashingService {
    public static async getUsers()
        : Promise<IUserToken[]> {

        const getAsync: any = promisify(redisClient.get).bind(redisClient);
        const users: string = await getAsync("users");
        return users? JSON.parse(users): [];
    }

    public static async addUser(
        refreshToken: string,
        userId: number
        ): Promise<void> {

        const user: IUserToken = {
            userId: userId,
            refreshToken: refreshToken
        };

        let users: IUserToken[] = await UserCashingService.getUsers();

        users.push(user);

        console.log(users);

        if(users.includes(user)) {
            throw new Error("User is already logged in, You need to logout first.");
        } else {
            const setAsync: any = promisify(redisClient.set).bind(redisClient);
            await setAsync("users", JSON.stringify(users));
        }
    }

    public static async removeUser(
        userId: number
    ): Promise<boolean> {
        let users: IUserToken[] = await UserCashingService.getUsers();
        users = users.filter(user => user.userId === userId);
        const setAsync: any = promisify(redisClient.set).bind(redisClient);
        await setAsync("users", JSON.stringify(users));
        return true;
    }
}