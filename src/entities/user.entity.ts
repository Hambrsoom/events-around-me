import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";

import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsUsernameAlreadyExist } from "../validators/isUsernameExist";

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

    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
}

@InputType()

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    @IsUsernameAlreadyExist({message: "username already exists!"})
    username: string;

    @Field()
    @Length(8, 100)
    password: string;
}
