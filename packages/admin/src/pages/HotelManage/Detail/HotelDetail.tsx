/**
 * 酒店详情查看页面（商户端）
 * 展示酒店的完整信息
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Spin, message, Empty, Button } from 'antd';
import { useHotelDetail } from '@/hooks';
import { mockSubmitHotelForReview } from '@/mock/hotel';
import HotelStatusDisplay from '@/components/HotelStatus';
import HotelActions from '@/components/HotelActions';
import { HotelBasicInfo, HotelInfoCards } from '@/components/HotelInfoDisplay';
import RoomEditor from '@/components/RoomEditor';
import { ROUTES } from '@/types/constants';
import { submitHotelForReview } from '@/services/hotel';
import './HotelDetail.css';

// 是否使用 Mock 数据（true = 使用 Mock，false = 使用真实 API）
const USE_MOCK = false;

const HotelDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState(false);

  // 使用自定义Hook加载酒店详情
  const { loading, hotel, reload } = useHotelDetail({ id, useMock: USE_MOCK });

  /** 提交审核 */
  const handleSubmitReview = async () => {
    if (!hotel) return;

    try {
      setSubmitting(true);
      if (USE_MOCK) {
        const res = mockSubmitHotelForReview(hotel.id);
        if (res.success) {
          message.success(res.message || '提交审核成功（Mock）');
        } else {
          message.error(res.message || '提交审核失败（Mock）');
        }
      } else {
        await submitHotelForReview(hotel.id);
        message.success('提交审核成功，请等待管理员审核');
      }
      await reload(); // 重新加载数据
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || '提交审核失败';
      message.error(errorMsg);
      console.error('Submit review error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /** 编辑酒店 */
  const handleEdit = () => {
    if (hotel) {
      navigate(ROUTES.MERCHANT.HOTEL_EDIT(hotel.id));
    }
  };

  /** 返回列表 */
  const handleBack = () => {
    navigate(ROUTES.MERCHANT.HOTELS);
  };

  if (loading) {
    return (
      <div className="hotel-detail-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-empty">
        <Empty description="酒店信息不存在" />
        <Button type="primary" onClick={handleBack}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className="hotel-detail-container">
      {/* 操作栏 */}
      <Card className="action-card">
        <div className="action-bar">
          <HotelStatusDisplay
            status={hotel.status}
            rejectReason={hotel.rejectReason}
          />
          
          <HotelActions
            hotel={hotel}
            loading={submitting}
            onEdit={handleEdit}
            onBack={handleBack}
            onSubmitReview={handleSubmitReview}
          />
        </div>
      </Card>

      {/* 基本信息 */}
      <HotelBasicInfo hotel={hotel} showMerchantInfo={false} />

      {/* 酒店详细信息卡片 */}
      <HotelInfoCards hotel={hotel} />

      {/* 房型管理 */}
      <RoomEditor hotelId={hotel.id} />
    </div>
  );
};

export default HotelDetail;
