import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Group } from "./Group";
import { Length, MinLength, MaxLength, IsString } from "class-validator";
import { UserLab } from './UserLab'
import * as bcrypt from "bcryptjs";
import { Exclude} from 'class-transformer';

export enum UserRole {
  PROFESSOR = "professor",
  STUDENT = "student",
}

@Entity({ name: "user" })
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @MinLength(4, {
    message: "$property is too short. Minimal length should be $constraint1",
  })
  @MaxLength(14, {
    message: "$property is too long. Maximal length should be $constraint1",
  })
  username: string;

  @MinLength(6, {
    message: "$property is too short. Minimal length should be $constraint1",
  })
  @MaxLength(20, {
    message: "$property is too long. Maximal length should be $constraint1",
  })

  @Column()
  @Exclude()
  password: string;

  @Length(2, 20)
  @Column()
  firstname: string;

  @Length(3, 20)
  @Column()
  lastname: string;


  @ManyToOne(() => Group, (group) => group.id, {nullable: true})
  group: Group;

  @Column({
    type: "set",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserLab, (userLab) => userLab.user)
  userLabs: UserLab[]

  hashPassword(): void {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
