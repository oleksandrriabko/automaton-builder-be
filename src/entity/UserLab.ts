import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { Lab } from "./Lab";
import { User } from "./User";


@Entity()
export class UserLab {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    user: string;

    @Column("text")
    automataCodes: string;

    @ManyToOne(() => Lab, (lab) => lab.id)
    lab: string;

    @Column()
    status: string
}
