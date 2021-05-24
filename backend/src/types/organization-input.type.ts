import { IsUrl, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Organization } from "../entities/organization.entity";
import { AddressInput } from "./address-input.type";

@InputType()
export class OrganizationInput implements Partial<Organization> {
  @Field({nullable: true})
  @Length(4, 50)
  public name: string;

  @Field({nullable: true})
  @Length(9, 100)
  @IsUrl()
  public url: string;

  @Field(() => AddressInput, {nullable: true})
  public address: AddressInput;
}
