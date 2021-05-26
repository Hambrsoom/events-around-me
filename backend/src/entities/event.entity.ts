import { Field, ID, ObjectType } from "type-graphql";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventCachingService } from "../services/event/event-caching.service";
import INode from "../types/node.type";
import { Address } from "./address/address.entity";
import { Image } from "./image.entity";
import { Organization } from "./organization.entity";

@ObjectType({implements: [INode]})
@Entity()
export class Event extends INode {
  @PrimaryGeneratedColumn()
  public id?: string;

  @Field()
  @Column({nullable: false})
  public title!: string;

  @Field()
  @Column({nullable: false})
  public url!: string;

  @Field()
  @Column({nullable: true, type: "mediumtext"})
  public description!: string;

  @Field(() =>  Address)
  @OneToOne(() => Address , { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
  @JoinColumn()
  public address!: Address;

  @Field()
  @Column({nullable: true})
  public date!: Date;

  @Field(() => Organization)
  @ManyToOne(() => Organization, (organization) => organization.events)
  public organizer!: Organization;

  @Field(() => [Image])
  @OneToMany(() => Image, (image) => image.event)
  public images?: Image[];

  @AfterUpdate()
  @AfterRemove()
  @AfterInsert()
  public invalidateCache() {
    EventCachingService.setNotUpToDate();
  }
}
