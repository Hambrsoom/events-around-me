import { Field, InputType } from "type-graphql";
import { Address } from "../entities/address/address.entity";
import { City } from "../entities/address/city.enum";
import { Country } from "../entities/address/country.enum";
import { Province } from "../entities/address/province.enum";
import { IsPostalCodeValid } from "../validators/is-postal-code.validator";

@InputType()
export class AddressInput extends Address {
  @Field({nullable: true})
  public street: string;

  @Field({nullable: true})
  @IsPostalCodeValid({message: "Not a valid postal code"})
  public postalCode: string;

  @Field(() => City, {nullable: true})
  public city: City;

  @Field(() => Province, {nullable: true})
  public province: Province;

  @Field(() => Country, {nullable: true})
  public country: Country;

  @Field({nullable: true})
  public appartmentNumber?: number;
}
