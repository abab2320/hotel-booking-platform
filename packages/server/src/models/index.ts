import { User } from './user.model';
import { Hotel } from './hotel.model';
import { RoomType } from './room-type.model';
import { Banner } from './banner.model';
import { City } from './city.model';
import { sequelize } from '../config/database';

// 定义关联关系
export function setupAssociations() {
  // 一对多：User - Hotel
  User.hasMany(Hotel, {
    foreignKey: 'merchantId',
    as: 'hotels',
    onDelete: 'CASCADE'
  });
  
  Hotel.belongsTo(User, {
    foreignKey: 'merchantId',
    as: 'merchant'
  });
  
  // 一对多：Hotel - RoomType
  Hotel.hasMany(RoomType, {
    foreignKey: 'hotelId',
    as: 'rooms',
    onDelete: 'CASCADE'
  });
  
  RoomType.belongsTo(Hotel, {
    foreignKey: 'hotelId',
    as: 'hotel'
  });
  
  // 一对多：Hotel - Banner
  Hotel.hasMany(Banner, {
    foreignKey: 'hotelId',
    as: 'banners',
    onDelete: 'CASCADE'
  });
  
  Banner.belongsTo(Hotel, {
    foreignKey: 'hotelId',
    as: 'hotel'
  });
}

// 导出所有模型
export {
  sequelize,
  User,
  Hotel,
  RoomType,
  Banner,
  City
};