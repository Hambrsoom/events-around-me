import { cache, del, exist, readCache } from "../../redis-connection";

export class UserCachingService {

  public static async isUserIdCached (
    userId: string,
    ): Promise<number> {
      return await exist(userId);
  }

  public static async isRefreshTokenValidInCache (
    userId: string,
    refreshToken: string,
    ): Promise<boolean> {
      return (await readCache(userId)) === refreshToken;
  }

  public static async cachingUser(
    refreshToken: string,
    userId: string,
    ): Promise<void> {
      await cache(userId, refreshToken);
  }

  public static async removeUserFromCache(
    userId: string,
    ): Promise<boolean> {
      await del(userId);
      return true;
  }
}
