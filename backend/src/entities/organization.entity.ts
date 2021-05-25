import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address/address.entity";
import { Event } from "./event.entity";
import { User } from "./user/user.entity";

@ObjectType()
@Entity()
export class Organization {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: string;

  @Field()
  @Column({unique: true, nullable: false})
  public name!: string;

  @Field()
  @Column({unique: true, nullable: false})
  public url!: string;

  @Field(() => Address)
  @OneToOne(() => Address, {
      cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE",
  })
  @JoinColumn()
  public address!: Address;

  @Field(() => [Event])
  @OneToMany(
    () => Event,
    (event) => event.organizer,
    {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
  public events?: Event[];

  @Field(() => User)
  @OneToOne(() => User, {
    cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE",
  })
  @JoinColumn()
  public user?: User;
}
