import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RoomTypeAttributes {
  id: number;
  hotelId: number;
  name: string;
  images: string[];
  bedType: string;
  maxGuests: number;
  area?: number;
  price: number;
  originalPrice?: number;
  breakfast: 'none' | 'single' | 'double';
  totalRooms: number;
  availableRooms: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RoomTypeCreationAttributes extends Optional<RoomTypeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class RoomType extends Model<RoomTypeAttributes, RoomTypeCreationAttributes> implements RoomTypeAttributes {
  declare id: number;
  declare hotelId: number;
  declare name: string;
  declare images: string[];
  declare bedType: string;
  declare maxGuests: number;
  declare area?: number;
  declare price: number;
  declare originalPrice?: number;
  declare breakfast: 'none' | 'single' | 'double';
  declare totalRooms: number;
  declare availableRooms: number;
  declare discountType?: 'percentage' | 'fixed';
  declare discountValue?: number;
  declare discountDesc?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RoomType.init({
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('images');
      return Array.isArray(value) ? value : [];
    }
  },
  bedType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  maxGuests: {
    type: DataTypes.TINYINT,
    defaultValue: 2,
    validate: { min: 1 }
  },
  area: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  breakfast: {
    type: DataTypes.ENUM('none', 'single', 'double'),
    defaultValue: 'none'
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  availableRooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: true
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discountDesc: {
    type: DataTypes.STRING(100),
    allowNull: true
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
  modelName: 'RoomType',
  tableName: 'room_types',
  timestamps: true,
  underscored: true
});