import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../entities/user/user.entity";

@InputType()
export class LoginUserInput implements Partial<User> {
    @Field()
    @Length(4, 20)
    public username: string;

    @Field()
    @Length(8, 50)
    public password: string;
}
