import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";

@ObjectType()
@Entity()
export class Address extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column()
    street!: string;

    @Field()
    @Column()
    zipCode!: string;

    @Field()
    @Column({nullable: true})
    appartmentNumber?: number;

    @Field()
    @Column({default: "Montreal"})
    city: string;

    @Field()
    @Column({default: "Quebec"})
    province: string;

    @Field()
    @Column({default: "Canada"})
    country: string;

    equal(
        address: Address
        ): boolean {

            return (
                this.street === address.street &&
                this.zipCode === address.zipCode &&
                this?.appartmentNumber === address?.appartmentNumber
            );
    }
}

@InputType()
export class AddressInput extends Address {
    @Field({nullable: true})
    id: number;

    @Field({nullable: true})
    street: string;

    @Field({nullable: true})
    @Length(6, 7)
    zipCode: string;

    @Field({nullable: true})
    appartmentNumber: number;
}