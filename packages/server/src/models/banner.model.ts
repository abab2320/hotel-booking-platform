import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface BannerAttributes {
  id: number;
  hotelId: number;
  image: string;
  title?: string;
  sort: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BannerCreationAttributes extends Optional<BannerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Banner extends Model<BannerAttributes, BannerCreationAttributes> implements BannerAttributes {
  declare id: number;
  declare hotelId: number;
  declare image: string;
  declare title?: string;
  declare sort: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Banner.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Banner',
  tableName: 'banners',
  timestamps: true,
  underscored: true
});