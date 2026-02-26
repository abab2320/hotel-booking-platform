/**
 * 草稿箱页面（商户端）
 * 功能：仅展示状态为"草稿"的酒店
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel } from '@/types';
import { ROUTES } from '@/types/constants';
import { useHotelList } from '@/hooks';
import { createHotelColumns, type ColumnCallbacks } from '@/components/HotelTable';
import RejectReasonModal from '@/components/RejectReasonModal/RejReasonModal';
import '../List/HotelList.css'; // 复用酒店列表的样式

// 是否使用 Mock 数据（true = 使用 Mock，false = 使用真实 API）
const USE_MOCK = false;

const DraftBox: React.FC = () => {
  const navigate = useNavigate();
  
  // 使用自定义 Hook 管理酒店列表状态和操作
  // fixedStatus: 'draft' 固定只显示草稿状态的酒店
  const {
    loading,
    hotelList,
    total,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleDelete,
    handleSubmitReview,
  } = useHotelList({ 
    useMock: USE_MOCK,
    fixedStatus: 'draft', // 固定为草稿状态
  });

  // UI 相关状态
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [currentRejectReason, setCurrentRejectReason] = useState<string | undefined>();

  /** 查看被拒绝的原因 */
  const showRejectReasonModal = (reason?: string) => {
    setCurrentRejectReason(reason);
    setRejectReasonModalOpen(true);
  };

  /** 关闭拒绝原因弹窗 */
  const closeRejectReasonModal = () => {
    setRejectReasonModalOpen(false);
    setCurrentRejectReason(undefined);
  };

  /** 定义操作回调函数 */
  const callbacks: ColumnCallbacks = {
    onView: (hotel: Hotel) => {
      navigate(ROUTES.MERCHANT.HOTEL_DETAIL(hotel.id));
    },
    onEdit: (hotel: Hotel) => {
      navigate(ROUTES.MERCHANT.HOTEL_EDIT(hotel.id));
    },
    onDelete: handleDelete,
    onSubmitReview: handleSubmitReview,
    onViewRejectReason: showRejectReasonModal,
  };

  /** 使用工厂函数创建表格列配置 */
  const columns = createHotelColumns('merchant', callbacks);

  return (
    <div className="hotel-list-container">
      <Card>
        {/* 页面标题和操作栏 */}
        <div className="hotel-list-header">
          <h2 className="page-title">草稿箱</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ROUTES.MERCHANT.HOTEL_NEW)}
            size="large"
          >
            新增酒店
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="hotel-list-filters">
          <Space size="middle">
            <span style={{ color: '#999' }}>
              这里显示所有未提交审核的草稿酒店，您可以继续编辑或提交审核
            </span>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={hotelList}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条草稿`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      {/* 拒绝原因弹窗 */}
      <RejectReasonModal
        open={rejectReasonModalOpen}
        reason={currentRejectReason}
        onClose={closeRejectReasonModal}
      />
    </div>
  );
};

export default DraftBox;
