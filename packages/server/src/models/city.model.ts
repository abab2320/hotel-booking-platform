import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CityAttributes {
  id: number;
  name: string;
  pinyin?: string;
  hot: boolean;
  sort: number;
}

interface CityCreationAttributes extends Optional<CityAttributes, 'id' | 'sort'> {}

export class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  declare id: number;
  declare name: string;
  declare pinyin?: string;
  declare hot: boolean;
  declare sort: number;
}

City.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  pinyin: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  hot: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'City',
  tableName: 'cities',
  timestamps: false
});