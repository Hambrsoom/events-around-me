"use strict";
import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";

import { ObjectType, Field, ID, InputType, Authorized } from "type-graphql";
import { IsUsernameAlreadyExist } from "../validators/isUsernameExist";
import { Organization } from "./organization.entity";

export enum Role {
  admin = "ADMIN",
  organizer = "ORGANIZER",
  regular = "REGULAR"
}

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({unique: true})
    @Length(4, 20)
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    salt: string;

    @Column({default: Role.regular})
    role: Role;

    @Authorized([Role.organizer])
    @Field(() => Organization)
    @OneToOne(() => Organization, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    organization?: Organization;


    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
}

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    @IsUsernameAlreadyExist({message: "username already exists!"})
    username: string;

    @Field()
    @Length(8, 100)
    password: string;
}
