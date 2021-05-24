import { IsPositive } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class CursorInput {
  @Field(() => ID, {nullable: true})
  public after?: string;

  @Field({nullable: true})
  @IsPositive()
  public first: number;
}
