import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import findCoordinates from "../../services/geocoding.service";
import CoordinatesInput from "../../types/coordinates-input.type";
import { City } from "./city.enum";
import { Country } from "./country.enum";
import { Province } from "./province.enum";

@ObjectType()
@Entity()
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: string;

  @Field()
  @Column({nullable: false})
  public street!: string;

  @Field()
  @Column({nullable: false})
  public postalCode!: string;

  @Field()
  @Column({nullable: true})
  public appartmentNumber?: number;

  @Field(() => City)
  @Column({default: City.Montreal})
  public city: City;

  @Field(() => Province)
  @Column({default: Province.Quebec})
  public province: Province;

  @Field(() => Country)
  @Column({default: Country.Canada})
  public country: Country;

  @Field()
  @Column("decimal", { precision: 11, scale: 8 })
  public latitude: number;

  @Field()
  @Column("decimal", { precision: 11, scale: 8 })
  public longitude: number;

  @BeforeInsert()
  public async generateLongitudeAndLatitude(
  ): Promise<void> {
    const coordinates: CoordinatesInput = await findCoordinates(this.convertAddressToString());
    this.latitude = coordinates.latitude;
    this.longitude =  coordinates.longitude;
  }

  public equal(
    address: Address,
    ): boolean {
        return (
            JSON.stringify(this) === JSON.stringify(address)
        );
  }

  public convertAddressToString(
  ): string {
    const appartment: string = this.appartmentNumber ? this.appartmentNumber + "-" : "";
    const city = this.city ? this.city : "Montreal";
    const province = this.country ? this.province : "Quebec";
    const country = this.country ? this.country : "Canada";

    return appartment + this.street + ", " + city + ", " +
            province + ", " + country;
  }
}
