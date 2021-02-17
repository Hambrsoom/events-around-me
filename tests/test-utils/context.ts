import { getAccessToken } from "./user-helper-methods";

export const getContext = async(
    username: string,
    password: string
    ) => {
        const accessToken: string = await getAccessToken(username, password);

        return {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };
};