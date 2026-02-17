/**
 * 酒店列表页面（商户端）
 * 功能：展示当前商户的所有酒店及状态
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel } from '@/types';
import { HOTEL_STATUS_CONFIG, ROUTES } from '@/types/constants';
import { useHotelList } from '@/hooks';
import { createHotelColumns, type ColumnCallbacks } from '@/components/HotelTable';
import RejectReasonModal from '@/components/RejectReasonModal';
import './HotelList.css';

// 是否使用 Mock 数据（true = 使用 Mock，false = 使用真实 API）
const USE_MOCK = true;

const { Option } = Select;

const HotelList: React.FC = () => {
  const navigate = useNavigate();
  
  // 使用自定义 Hook 管理酒店列表状态和操作
  const {
    loading,
    hotelList,
    total,
    currentPage,
    pageSize,
    statusFilter,
    setCurrentPage,
    setPageSize,
    setStatusFilter,
    handleDelete,
    handleSubmitReview,
  } = useHotelList({ useMock: USE_MOCK });

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
          <h2 className="page-title">酒店管理</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ROUTES.MERCHANT.HOTEL_NEW)}
            size="large"
          >
            新增酒店
          </Button>
        </div>

        {/* 筛选栏 */}
        <div className="hotel-list-filters">
          <Space size="middle">
            <span>状态筛选：</span>
            <Select
              style={{ width: 150 }}
              placeholder="全部状态"
              allowClear
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              {Object.entries(HOTEL_STATUS_CONFIG).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.text}
                </Option>
              ))}
            </Select>
              
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
            showTotal: (total) => `共 ${total} 条`,
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

export default HotelList;
