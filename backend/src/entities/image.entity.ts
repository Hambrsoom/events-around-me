import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@ObjectType()
@Entity()
export class Image {
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
