import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsUrl, MaxLength } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address/address.entity";
import { Organization } from "./organization.entity";
import { Image } from "./image.entity";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column({nullable: false})
    title: string;

    @Field()
    @Column({nullable: false})
    url: string;

    @Field(() =>  Address)
    @OneToOne(() => Address , { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    address: Address;

    @Field()
    @Column({nullable: false})
    date: Date;

    @Field(() => Organization)
    @ManyToOne(() => Organization, organization => organization.events)
    organizer: Organization;

    @Field(()=> [Image])
    @OneToMany(()=> Image, image => image.event)
    images?: Image[];
}

@InputType()
export class EventInput implements Partial<Event> {
    @Field({nullable: true})
    @MaxLength(50)
    title: string;

    @Field({nullable: true})
    @MaxLength(2048)
    @IsUrl()
    url: string;

    @Field({nullable: true})
    date: Date;

    @Field(() =>  AddressInput, {nullable: true})
    address: AddressInput;
}