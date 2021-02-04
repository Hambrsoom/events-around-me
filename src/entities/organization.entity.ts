import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address.entity";
import { Event } from "./event.entity";

@ObjectType()
@Entity()
@Unique(["name"])
export class Organization extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column()
    @Length(4, 50)
    name!: string;

    @Field()
    @Column()
    @Length(4, 100)
    url!: string;

    @Field(() => Address)
    @OneToOne(() => Address, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    address!: Address;

    @Field(()=> [Event])
    @OneToMany(() => Event, event => event.organizer, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    events?: Event[];
}

@InputType()
export class OrganizationInput implements Partial<Organization> {
    @Field(() => ID, {nullable: true} )
    id: number;

    @Field({nullable: true})
    name: string;

    @Field({nullable: true})
    url: string;

    @Field(() => AddressInput, {nullable: true})
    addressInput: AddressInput;
}