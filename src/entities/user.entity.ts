import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";

import { ObjectType, Field, ID } from "type-graphql";


@ObjectType()
@Entity()
@Unique(["username"])
export class User extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(8, 100)
    password: string;

    @Column({nullable: true})
    salt: string;

    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
}