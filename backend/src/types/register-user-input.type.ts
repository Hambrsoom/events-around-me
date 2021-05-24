import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../entities/user/user.entity";
import { IsUsernameAlreadyExist } from "../validators/is-username-already-exist.validator";

@InputType()
export class RegisterUserInput implements Partial<User> {
  @Field()
  @IsUsernameAlreadyExist({message: "username already exists!"})
  @Length(4, 20)
  public username: string;

  @Field()
  @Length(8, 50)
  public password: string;
}
