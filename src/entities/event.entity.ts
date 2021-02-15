import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsUrl, Length, MaxLength } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address.entity";
import { Organization } from "./organization.entity";
import { Image } from "./image.entity";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    url: string;

    @Field(() =>  Address)
    @OneToOne(() => Address , { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    address: Address;

    @Field()
    @Column({default: null})
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
    id: number;

    @Field({nullable: true})
    @Length(4, 50)
    title: string;

    @Field({nullable: true})
    @MaxLength(200)
    @IsUrl()
    url: string;

    @Field({nullable: true})
    date: Date;

    @Field(() =>  AddressInput, {nullable: true})
    address: AddressInput;

    @Field({nullable: true})
    organizerId: number;
}