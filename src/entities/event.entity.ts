import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Length } from "class-validator";
import { ObjectType, Field, ID } from "type-graphql";
import { Address } from "./address.entity";
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
    @OneToOne(() => Address)
    address: Address;

    @Field(() => Organization)
    @ManyToOne(() => Organization, organization => organization.events)
    organizer: Organization;
}