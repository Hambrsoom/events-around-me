import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn, ManyToOne, Tree } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Address, AddressInput } from "./address.entity";
import { Organization } from "./organization.entity";

@ObjectType()
@Entity()
@Unique(["title"])
export class Event extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    @Length(4, 50)
    title: string;

    @Field()
    @Column()
    @Length(4, 100)
    url: string

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
}


@InputType()
export class EventInput implements Partial<Event> {
    @Field({nullable: true})
    id: number;

    @Field()
    title: string;

    @Field()
    url: string;

    @Field({nullable: true})
    date: Date;

    @Field(() =>  AddressInput)
    address: AddressInput;

    @Field()
    organizerID: number;
}