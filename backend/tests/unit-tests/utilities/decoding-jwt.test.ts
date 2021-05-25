import { getUserIdFromJwt, getUsernameFromJwt } from "../../../src/utilities/decoding-jwt";

describe("Test the jwt functionalities", () => {
  // tslint:disable-next-line:max-line-length
  let jwt: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiSGFtcGljIiwiaWF0IjoxNjEzNTMyOTcyLCJleHAiOjE2MTM1MzY1NzJ9.Wvbk4MJ6GPWTUkuJsiyC-U_AI8EdUIXdS7bLiVyTbEw";

  test("get the user id from jwt successfully", () => {
    const id: string = getUserIdFromJwt(jwt);
    expect(id).toBe(1);
  });

  test("get the username from jwt successfully", () => {
      const username: string = getUsernameFromJwt(jwt);
      expect(username).toBe("Hampic");
  });

  test("get the user id from jwt failure by passing invalid jwt",  () =>{
    jwt = "123";
    try {
        getUserIdFromJwt(jwt);
    } catch(err) {
        expect(err.message).toContain("Invalid token");
    }
  });

  test("get the username from jwt failure by passing invalid jwt",  () =>{
    jwt = "123";
    try {
        getUsernameFromJwt(jwt);
    } catch(err) {
        expect(err.message).toContain("Invalid token");
    }
  });
});
