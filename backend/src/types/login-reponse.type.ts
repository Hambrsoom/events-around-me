import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class LoginResponse {
  @Field()
  public accessToken?: string;

  @Field()
  public refreshToken?: string;
}
