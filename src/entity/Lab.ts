import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Group } from "./Group";
import { UserLab } from "./UserLab";

@Entity({ name: 'lab'})
export class Lab {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {length: '255'})
    title: string

    @Column("text", { nullable: true})
    description: string

    @Column("text")
    automataCodes: string;
    
    @ManyToMany(() => Group, (group) => group.labs)
    @JoinTable()
    groups: Group[]

    @OneToMany(() => UserLab, (userLab) => userLab.lab)
    userLabs: UserLab[]

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
}
