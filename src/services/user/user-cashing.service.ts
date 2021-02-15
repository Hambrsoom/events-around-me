import { setAsync, existAsync, getAsync, delAsync } from "../../redis-connection";

export class UserCashingService {

    public static async isUserExist (
        userId: number
        ): Promise<number> {
            return await existAsync(userId);
    }

    public static async isrefreshTokenValid (
        userId: number,
        refreshToken: string
        ): Promise<boolean> {
            return (await getAsync(userId)) === refreshToken;
    }

    public static async addUser(
        refreshToken: string,
        userId: number
        ): Promise<void> {
            await setAsync(userId, refreshToken);
    }

    public static async removeUser(
        userId: number
        ): Promise<boolean> {
            await delAsync(userId);
            return true;
    }
}