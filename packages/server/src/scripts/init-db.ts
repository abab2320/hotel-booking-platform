import { sequelize, User, Hotel, RoomType, Banner, City, setupAssociations } from '../models';

async function initDatabase() {
  try {
    // 设置关联
    setupAssociations();
    
    // 同步数据库
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库同步成功');
    
    // 检查是否已有数据
    const cityCount = await City.count();
    
    if (cityCount === 0) {
      console.log('📝 初始化示例数据...');
      
      // 初始化城市数据
      await City.bulkCreate([
        { name: '北京', pinyin: 'beijing', hot: true, sort: 1 },
        { name: '上海', pinyin: 'shanghai', hot: true, sort: 2 },
        { name: '广州', pinyin: 'guangzhou', hot: true, sort: 3 },
        { name: '深圳', pinyin: 'shenzhen', hot: true, sort: 4 },
        { name: '杭州', pinyin: 'hangzhou', hot: false, sort: 5 }
      ]);
      
      console.log('✅ 示例数据初始化完成');
    }
    
    await sequelize.close();
    console.log('✅ 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();