import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type HotelStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'offline';

interface HotelAttributes {
  id: number;
  merchantId: number;
  nameZh: string;
  nameEn: string;
  address: string;
  city: string;
  star: 1 | 2 | 3 | 4 | 5;
  openDate: Date;
  images: string[];
  facilities?: string[];
  tags?: string[];
  nearbyAttractions?: string;
  nearbyTransport?: string;
  description?: string;
  rating?: number;
  status: HotelStatus;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HotelCreationAttributes extends Optional<HotelAttributes, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'facilities' | 'tags' | 'rating'> {}

export class Hotel extends Model<HotelAttributes, HotelCreationAttributes> implements HotelAttributes {
  declare id: number;
  declare merchantId: number;
  declare nameZh: string;
  declare nameEn: string;
  declare address: string;
  declare city: string;
  declare star: 1 | 2 | 3 | 4 | 5;
  declare openDate: Date;
  declare images: string[];
  declare facilities?: string[];
  declare tags?: string[];
  declare nearbyAttractions?: string;
  declare nearbyTransport?: string;
  declare description?: string;
  declare rating?: number;
  declare status: HotelStatus;
  declare rejectReason?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  
  // 关联属性（稍后定义）
  declare rooms?: any[];
  declare banners?: any[];
  declare merchant?: any;
}

Hotel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  merchantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  nameZh: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  nameEn: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  star: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  openDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('images');
      return Array.isArray(value) ? value : [];
    }
  },
  facilities: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('facilities');
      return Array.isArray(value) ? value : [];
    }
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('tags');
      return Array.isArray(value) ? value : [];
    }
  },
  nearbyAttractions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nearbyTransport: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'published', 'offline'),
    defaultValue: 'draft'
  },
  rejectReason: {
    type: DataTypes.STRING(255),
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
  modelName: 'Hotel',
  tableName: 'hotels',
  timestamps: true,
  underscored: true
});