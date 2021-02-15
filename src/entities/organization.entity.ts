import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { MaxLength } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address.entity";
import { Event } from "./event.entity";

@ObjectType()
@Entity()
export class Organization extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column({unique: true})
    name!: string;

    @Field()
    @Column()
    url!: string;

    @Field(() => Address)
    @OneToOne(() => Address, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    address!: Address;

    @Field(()=> [Event])
    @OneToMany(() => Event, event => event.organizer, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    events?: Event[];
}

@InputType()
export class OrganizationInput implements Partial<Organization> {
    @Field({nullable: true})
    id: number;

    @Field({nullable: true})
    @MaxLength(30)
    name: string;

    @Field({nullable: true})
    @MaxLength(100)
    url: string;

    @Field(() => AddressInput, {nullable: true})
    addressInput: AddressInput;
}