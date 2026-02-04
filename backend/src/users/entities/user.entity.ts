import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserCreationAttrs } from '../dto/create-user.dto';

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare role: string;
}
