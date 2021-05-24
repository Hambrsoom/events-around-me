import { IsDate, IsUrl, Length, ValidateNested } from "class-validator";
import { Field, InputType } from "type-graphql";
import { AddressInput } from "./address-input.type";

@InputType()
export class EventInput {
  @Field({nullable: true})
  @Length(1, 50)
  public title: string;

  @Field({nullable: true})
  @IsUrl()
  public url: string;

  @Field({nullable: true})
  @IsDate()
  public date: Date;

  @Field(() =>  AddressInput, {nullable: true})
  @ValidateNested()
  public address: AddressInput;

  @Field({nullable: true})
  public description: string;
}
