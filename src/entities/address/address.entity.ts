import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Country } from "./country.enum";
import { Province } from "./province.enum";
import { City } from "./city.enum";

@ObjectType()
@Entity()
export class Address extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id?: string;

    @Field()
    @Column({nullable: false})
    street!: string;

    @Field()
    @Column({nullable: false})
    postalCode!: string;

    @Field()
    @Column({nullable: true})
    appartmentNumber?: number;

    @Field(() => City)
    @Column({default: City.Montreal})
    city: City;

    @Field(() => Province)
    @Column({default: Province.Quebec})
    province: Province;

    @Field(() => Country)
    @Column({default: Country.Canada})
    country: Country;

    equal(
        address: Address
        ): boolean {
            return (
                JSON.stringify(this) === JSON.stringify(address)
            );
    }
}

@InputType()
export class AddressInput extends Address {
    @Field({nullable: true})
    street: string;

    @Field({nullable: true})
    @Length(6, 7)
    postalCode: string;

    @Field({nullable: true})
    appartmentNumber: number;
}