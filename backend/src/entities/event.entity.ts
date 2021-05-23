import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsDate, IsUrl, Length, ValidateNested } from "class-validator";
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

    @Field()
    @Column({nullable: true, type: "mediumtext"})
    description: string;

    @Field(() =>  Address)
    @OneToOne(() => Address , { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn()
    address: Address;

    @Field()
    @Column({nullable: true})
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
    @Length(1, 50)
    title: string;

    @Field({nullable: true})
    @IsUrl()
    url: string;

    @Field({nullable: true})
    @IsDate()
    date: Date;

    @Field(() =>  AddressInput, {nullable: true})
    @ValidateNested()
    address: AddressInput;

    @Field({nullable: true})
    description: string;
}