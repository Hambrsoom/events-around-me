import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Event } from "./event.entity";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Image extends BaseEntity {
    @Field(()=> ID)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field()
    @Column({nullable: false})
    path!: string;

    @Field(()=> Event)
    @ManyToOne(() => Event, event => event.images, { onDelete: "CASCADE" })
    event!: Event;
}
