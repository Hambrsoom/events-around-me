import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { IsUrl, MaxLength } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address/address.entity";
import { Event } from "./event.entity";

@ObjectType()
@Entity()
export class Organization extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id?: string;

    @Field()
    @Column({unique: true, nullable: false})
    name!: string;

    @Field()
    @Column({unique: true, nullable: false})
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
    @Field({nullable: true})
    @MaxLength(30)
    name: string;

    @Field({nullable: true})
    @MaxLength(100)
    @IsUrl()
    url: string;

    @Field(() => AddressInput, {nullable: true})
    address: AddressInput;
}