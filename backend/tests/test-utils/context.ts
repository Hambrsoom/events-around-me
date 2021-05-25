import { getUserIdFromJwt } from "../../src/utilities/decoding-jwt";
import { getAccessToken } from "./user-helper-methods";


export class ContextTest {
  public static async getContext(
    username: string,
    password: string
    ) {
      const accessToken: string = await getAccessToken(username, password);
      return {
        jwt: accessToken,
        req: {
          headers: {
              authorization: accessToken,
          },
        },
        userId:  getUserIdFromJwt(accessToken),
      };
    }
}
