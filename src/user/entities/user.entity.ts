import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        unique:true,
    })
    email: string;

    @Column('text')
    username: string;

    @Column('text')
    password: string;

    @Column({default:true})
    isActive: boolean;

    @Column({
        type: 'enum',
        array: true,
        enum: ['admi', 'user'],
        default: ['user']
    })
    roles: UserRole[];

}
export enum UserRole{
    ADMIN = 'admin',
    USER = 'user'
}