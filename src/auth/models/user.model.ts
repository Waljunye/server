import {BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";

interface UserCreationAttrs {
    readonly email: string;
    readonly password: string;
}
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{
    @Column({type: DataType.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true})
    userId: number;

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    email: string;

    @Column({type: DataType.STRING, allowNull: false, unique: false})
    password: string;

    @Column({type: DataType.BOOLEAN})
    isActivated: boolean;

    @Column({type: DataType.STRING})
    activationLink: string;
}
