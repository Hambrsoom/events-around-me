import { cache, del, exist, readCache } from "../../redis-connection";

export class UserCashingService {

  public static async isUserExist (
    userId: string,
    ): Promise<number> {
      return await exist(userId);
  }

  public static async isrefreshTokenValid (
    userId: string,
    refreshToken: string,
    ): Promise<boolean> {
      return (await readCache(userId)) === refreshToken;
  }

  public static async addUser(
    refreshToken: string,
    userId: string,
    ): Promise<void> {
      await cache(userId, refreshToken);
  }

  public static async removeUser(
    userId: string,
    ): Promise<boolean> {
      await del(userId);
      return true;
  }
}
