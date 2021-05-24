import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@ObjectType()
@Entity()
export class Image extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: string;

  @Field()
  @Column({nullable: false})
  public path!: string;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.images, { onDelete: "CASCADE" })
  public event!: Event;
}
