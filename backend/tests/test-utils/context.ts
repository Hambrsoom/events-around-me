import { Context } from "vm";
import { getUserIdFromJwt } from "../../src/utilities/decoding-jwt";
import { getAccessToken } from "./user-helper-methods";


export class ContextTest {
    public static async getContext(
        username: string,
        password: string
        ) {
            const accessToken: string = await getAccessToken(username, password);
            return {
                req: {
                    headers: {
                        authorization: accessToken
                    }
                },
                jwt: accessToken,
                userId:  getUserIdFromJwt(accessToken)
            };
        }
}