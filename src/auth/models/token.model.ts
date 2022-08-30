import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "./user.model";

interface TokenCreationAttrs{
    readonly userId: number;
    readonly refreshToken: string;
}
@Table({tableName: 'tokens'})
export class Token extends Model<Token, TokenCreationAttrs>{
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false, unique: true})
    userId: number;

    @Column({type: DataType.STRING(1000), unique:true, allowNull: false})
    refreshToken: string;
}
