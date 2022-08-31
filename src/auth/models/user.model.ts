import {BelongsTo, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface UserCreationAttrs {
    readonly username: string;
    readonly password: string;
}
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{
    @ApiProperty({ description: "User Id", nullable: false })
    @Column({type: DataType.INTEGER, allowNull: false, autoIncrement: true, unique: true, primaryKey: true})
    userId: number;

    @ApiProperty({ description: "User email", nullable: false })
    @Column({type: DataType.STRING, allowNull: false, unique: true})
    username: string;

    @ApiProperty({ description: "User password", nullable: false })
    @Column({type: DataType.STRING, allowNull: false, unique: false})
    password: string;

    @ApiProperty({ description: "Bullshit", nullable: false })
    @Column({type: DataType.BOOLEAN})
    isActivated: boolean;

    @ApiProperty({ description: "Bullshit x 2", nullable: false })
    @Column({type: DataType.STRING})
    activationLink: string;
}
