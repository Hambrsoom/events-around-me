import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, BeforeInsert } from "typeorm";
import { Length } from "class-validator";
import * as bcrypt from "bcryptjs";

import { ObjectType, Field, ID, InputType, Authorized } from "type-graphql";
import { IsUsernameAlreadyExist } from "../../validators/isUsernameExist";
import { Organization } from "../organization.entity";
import { Role } from "./user-role.enum";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column({unique: true, nullable: false})
    username: string;

    @Column("text", {nullable: false})
    password: string;

    @Column({nullable: false})
    salt?: string;

    @Field()
    @Column({default: Role.regular})
    role: Role;

    @Authorized([Role.organizer])
    @Field(() => Organization)
    @OneToOne(() => Organization, {
        cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"
    })
    @JoinColumn()
    organization?: Organization;


    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.salt = await bcrypt.genSalt();
        this.password = bcrypt.hashSync(this.password, this.salt);
    }

    async validatePassword(password: string): Promise<boolean> {
      const hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
}

@InputType()
export class RegisterUserInput implements Partial<User> {
    @Field()
    @IsUsernameAlreadyExist({message: "username already exists!"})
    @Length(4, 20)
    username: string;

    @Field()
    @Length(8, 100)
    password: string;
}

@InputType()
export class LoginUserInput implements Partial<User> {
    @Field()
    @Length(4, 20)
    username: string;

    @Field()
    @Length(8, 100)
    password: string;
}
