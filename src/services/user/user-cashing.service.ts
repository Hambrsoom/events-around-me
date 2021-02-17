import { setAsync, existAsync, getAsync, delAsync } from "../../redis-connection";

export class UserCashingService {

    public static async isUserExist (
        userId: string
        ): Promise<number> {
            return await existAsync(userId);
    }

    public static async isrefreshTokenValid (
        userId: string,
        refreshToken: string
        ): Promise<boolean> {
            return (await getAsync(userId)) === refreshToken;
    }

    public static async addUser(
        refreshToken: string,
        userId: string
        ): Promise<void> {
            await setAsync(userId, refreshToken);
    }

    public static async removeUser(
        userId: string
        ): Promise<boolean> {
            await delAsync(userId);
            return true;
    }
}