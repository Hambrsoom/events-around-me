import * as bcrypt from "bcryptjs";
import { Authorized, Field, ID, ObjectType } from "type-graphql";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "../organization.entity";
import { Role } from "./user-role.enum";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: string;

  @Field()
  @Column({unique: true, nullable: false})
  public username!: string;

  @Field()
  @Column({default: Role.regular})
  public role?: Role;

  @Authorized([Role.organizer])
  @Field(() => Organization)
  @OneToOne(() => Organization, {
      cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE",
  })
  @JoinColumn()
  public organization?: Organization;

  @Column("text", {nullable: false})
  public password!: string;

  @Column({nullable: false})
  private salt: string;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.salt = await bcrypt.genSalt();
    this.password = bcrypt.hashSync(this.password, this.salt);
  }

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
