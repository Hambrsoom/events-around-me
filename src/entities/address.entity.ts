import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Organization } from "./organization.entity";


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
    @Length(6, 7)
    zipCode!: string;

    @Field()
    @Column()
    appartmentNumber?: number;
    
    equal(address: Address): boolean {
        return ( 
            this.street === address.street &&
            this.zipCode === address.zipCode && 
            this?.appartmentNumber === address?.appartmentNumber
            )
    }

}

@InputType()
export class AddressInput extends Address implements Partial<Address>  {
    @Field({nullable: true})
    id: number

    @Field({nullable: true})
    street: string;

    @Field({nullable: true})
    zipCode: string;

    @Field({nullable: true})
    appartmentNumber: number;
}