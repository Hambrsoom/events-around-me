import jwt_decode from "jwt-decode";

export const getUserIdFromJwt = (jwt: string) => {
    return (jwt_decode(jwt)["userId"]);
};

export const getUsernameFromJwt = (jwt: string) => {
    return (jwt_decode(jwt)["username"]);
};
