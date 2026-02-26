/**
 * 酒店详细信息卡片展示组件
 * 包含：酒店图片、设施、标签、周边信息、酒店介绍
 */
import React from 'react';
import { Card, Image, Tag, Empty, Divider } from 'antd';
import { Hotel } from '@/types';
import { HOTEL_FACILITY_CONFIG, HOTEL_TAG_CONFIG } from '@/types/constants';

interface HotelInfoCardsProps {
  hotel: Hotel;
}

const HotelInfoCards: React.FC<HotelInfoCardsProps> = ({ hotel }) => {
  return (
    <>
      {/* 酒店图片 */}
      <Card title="酒店图片" className="info-card">
        {hotel.images && hotel.images.length > 0 ? (
          <div className="image-gallery">
            <Image.PreviewGroup>
              {hotel.images.map((image, index) => (
                <div key={index} className="image-item">
                  <Image
                    src={image}
                    alt={`酒店图片${index + 1}`}
                    width={200}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              ))}
            </Image.PreviewGroup>
          </div>
        ) : (
          <Empty description="暂无图片" />
        )}
      </Card>

      {/* 酒店设施 */}
      <Card title="酒店设施" className="info-card">
        {hotel.facilities && hotel.facilities.length > 0 ? (
          <div className="facility-list">
            {hotel.facilities.map((facility) => {
              const config = HOTEL_FACILITY_CONFIG[facility];
              return (
                <Tag key={facility} className="facility-tag">
                  <span className="facility-icon">{config.icon}</span>
                  <span>{config.label}</span>
                </Tag>
              );
            })}
          </div>
        ) : (
          <Empty description="暂无设施信息" />
        )}
      </Card>

      {/* 酒店标签 */}
      <Card title="酒店标签" className="info-card">
        {hotel.tags && hotel.tags.length > 0 ? (
          <div className="tag-list">
            {hotel.tags.map((tag) => {
              const config = HOTEL_TAG_CONFIG[tag];
              return (
                <Tag key={tag} color={config.color} className="hotel-tag">
                  {config.label}
                </Tag>
              );
            })}
          </div>
        ) : (
          <Empty description="暂无标签" />
        )}
      </Card>

      {/* 周边信息 */}
      {(hotel.nearbyAttractions || hotel.nearbyTransport) && (
        <Card title="周边信息" className="info-card">
          {hotel.nearbyAttractions && (
            <>
              <h4 className="info-subtitle">周边景点</h4>
              <p className="info-text">{hotel.nearbyAttractions}</p>
              {hotel.nearbyTransport && <Divider />}
            </>
          )}
          {hotel.nearbyTransport && (
            <>
              <h4 className="info-subtitle">交通信息</h4>
              <p className="info-text">{hotel.nearbyTransport}</p>
            </>
          )}
        </Card>
      )}

      {/* 酒店介绍 */}
      {hotel.description && (
        <Card title="酒店介绍" className="info-card">
          <p className="description-text">{hotel.description}</p>
        </Card>
      )}
    </>
  );
};

export default HotelInfoCards;
