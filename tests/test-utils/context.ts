import { getUserIdFromJwt } from "../../src/utilities/decoding-jwt";
import { getAccessToken } from "./user-helper-methods";

export const getContext = async(
    username: string,
    password: string
    ) => {
        const accessToken: string = await getAccessToken(username, password);
        console.log(accessToken);
        return {
            req: {
                headers: {
                    authorization: accessToken
                }
            },
            jwt: accessToken,
            userId:  getUserIdFromJwt(accessToken)
        };
};