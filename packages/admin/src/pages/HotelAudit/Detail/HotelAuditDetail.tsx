/**
 * 酒店审核详情页面（管理员端）
 * 功能：展示酒店的完整信息，并提供审核、发布、下线等管理操作
 * 布局：复用商户端的详情页面布局和样式，减少代码冗余
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Spin, message, Empty, Button, Modal, Input } from 'antd';
import { useHotelDetail } from '@/hooks';
import HotelStatusDisplay from '@/components/HotelStatus';
import AdminActions from '@/components/AdminActions';
import { HotelBasicInfo, HotelInfoCards } from '@/components/HotelInfoDisplay';
import RoomList from '@/components/RoomList';
import { ROUTES } from '@/types/constants';
import {
  approveHotel,
  rejectHotel,
  publishHotel,
  offlineHotel,
  restoreHotel,
} from '@/services/hotel';
import {
  mockApproveHotel,
  mockRejectHotel,
  mockPublishHotel,
  mockOfflineHotel,
  mockRestoreHotel,
} from '@/mock/hotelAdmin';
// 复用商户端的样式文件
import '../../HotelManage/Detail/HotelDetail.css';

const { TextArea } = Input;

// 是否使用 Mock 数据（true = 使用 Mock，false = 使用真实 API）
const USE_MOCK = false;

const HotelAuditDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 操作加载状态
  const [operating, setOperating] = useState(false);
  
  // 拒绝审核弹窗状态
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 使用自定义Hook加载酒店详情（管理员使用 useAdminApi）
  const { loading, hotel, reload } = useHotelDetail({ 
    id, 
    useMock: USE_MOCK,
    useAdminApi: !USE_MOCK, // 只有在非 mock 模式下才使用管理员 API
  });

  /**
   * 审核通过
   */
  const handleApprove = async (hotelId: number) => {
    try {
      setOperating(true);
      if (USE_MOCK) {
        const res = mockApproveHotel(hotelId);
        if (res.success) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        await approveHotel(hotelId);
        message.success('审核通过');
      }
      await reload(); // 重新加载数据
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setOperating(false);
    }
  };

  /**
   * 打开拒绝审核弹窗
   */
  const openRejectModal = () => {
    setRejectReason('');
    setRejectModalOpen(true);
  };

  /**
   * 确认拒绝审核
   */
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请输入拒绝原因');
      return;
    }

    if (!hotel) return;

    try {
      setOperating(true);
      if (USE_MOCK) {
        const res = mockRejectHotel(hotel.id, rejectReason);
        if (res.success) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        await rejectHotel(hotel.id, rejectReason);
        message.success('已拒绝');
      }
      setRejectModalOpen(false);
      await reload(); // 重新加载数据
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setOperating(false);
    }
  };

  /**
   * 发布上线
   */
  const handlePublish = async (hotelId: number) => {
    try {
      setOperating(true);
      if (USE_MOCK) {
        const res = mockPublishHotel(hotelId);
        if (res.success) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        await publishHotel(hotelId);
        message.success('发布成功');
      }
      await reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setOperating(false);
    }
  };

  /**
   * 下线
   */
  const handleOffline = async (hotelId: number) => {
    try {
      setOperating(true);
      if (USE_MOCK) {
        const res = mockOfflineHotel(hotelId);
        if (res.success) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        await offlineHotel(hotelId);
        message.success('已下线');
      }
      await reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setOperating(false);
    }
  };

  /**
   * 恢复上线
   */
  const handleRestore = async (hotelId: number) => {
    try {
      setOperating(true);
      if (USE_MOCK) {
        const res = mockRestoreHotel(hotelId);
        if (res.success) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        await restoreHotel(hotelId);
        message.success('已恢复上线');
      }
      await reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setOperating(false);
    }
  };

  /**
   * 返回列表
   */
  const handleBack = () => {
    navigate(ROUTES.ADMIN.HOTELS);
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="hotel-detail-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 数据不存在
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
      {/* 操作栏 - 使用管理员专用的操作组件 */}
      <Card className="action-card">
        <div className="action-bar">
          {/* 左侧：状态显示 */}
          <HotelStatusDisplay
            status={hotel.status}
            rejectReason={hotel.rejectReason}
          />
          
          {/* 右侧：管理员操作按钮 */}
          <AdminActions
            hotel={hotel}
            loading={operating}
            onBack={handleBack}
            onApprove={handleApprove}
            onReject={openRejectModal}
            onPublish={handlePublish}
            onOffline={handleOffline}
            onRestore={handleRestore}
          />
        </div>
      </Card>

      {/* 基本信息 */}
      <HotelBasicInfo hotel={hotel} showMerchantInfo={true} />

      {/* 酒店详细信息卡片 */}
      <HotelInfoCards hotel={hotel} />

      {/* 房型信息（只读） */}
      <RoomList hotelId={hotel.id} loadFromApi={true} useAdminApi={true} />

      {/* 拒绝审核弹窗 */}
      <Modal
        title="拒绝审核"
        open={rejectModalOpen}
        onOk={confirmReject}
        onCancel={() => setRejectModalOpen(false)}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true, loading: operating }}
        cancelButtonProps={{ disabled: operating }}
      >
        <div style={{ marginBottom: 8 }}>请输入拒绝原因：</div>
        <TextArea
          rows={4}
          placeholder="请输入拒绝原因，将会通知给商户"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          maxLength={200}
          showCount
        />
      </Modal>
    </div>
  );
};

export default HotelAuditDetail;
