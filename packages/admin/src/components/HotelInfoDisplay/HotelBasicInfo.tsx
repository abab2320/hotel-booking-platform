/**
 * 酒店基本信息展示组件
 * 可配置是否显示商户信息（管理员端需要，商户端不需要）
 */
import React from 'react';
import { Card, Descriptions, Rate, Space } from 'antd';
import { StarFilled, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Hotel } from '@/types';

interface HotelBasicInfoProps {
  hotel: Hotel;
  showMerchantInfo?: boolean; // 是否显示商户信息
}

const HotelBasicInfo: React.FC<HotelBasicInfoProps> = ({
  hotel,
  showMerchantInfo = false,
}) => {
  return (
    <Card title="基本信息" className="info-card">
      <Descriptions column={2} bordered>
        <Descriptions.Item label="酒店中文名称" span={2}>
          <strong>{hotel.nameZh}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="酒店英文名称" span={2}>
          {hotel.nameEn}
        </Descriptions.Item>
        <Descriptions.Item label="酒店地址" span={2}>
          {hotel.address}
        </Descriptions.Item>
        <Descriptions.Item label="所在城市">
          {hotel.city}
        </Descriptions.Item>
        <Descriptions.Item label="酒店星级">
          <Rate disabled defaultValue={hotel.star} character={<StarFilled />} />
          <span style={{ marginLeft: 8 }}>{hotel.star}星级</span>
        </Descriptions.Item>
        <Descriptions.Item label="开业日期">
          {dayjs(hotel.openDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        
        {/* 管理员端显示商户信息 */}
        {showMerchantInfo && (
          <Descriptions.Item label="所属商户">
            <Space>
              <UserOutlined />
              <span>{hotel.merchant?.username || `商户ID: ${hotel.merchantId}`}</span>
            </Space>
          </Descriptions.Item>
        )}
        
        <Descriptions.Item label="创建时间">
          {dayjs(hotel.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {dayjs(hotel.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default HotelBasicInfo;
