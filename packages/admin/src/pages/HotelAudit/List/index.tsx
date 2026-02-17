/**
 * 酒店审核列表页面（管理员端）
 * 功能：展示所有待审核和已审核的酒店，支持审核、发布、下线等操作
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Select, Space, Modal, Input, message } from 'antd';
import type { Hotel } from '@/types';
import { HOTEL_STATUS_CONFIG, ROUTES } from '@/types/constants';
import { useAdminHotelList } from '@/hooks';
import { createHotelColumns, type ColumnCallbacks } from '@/components/HotelTable';
import RejectReasonModal from '@/components/RejectReasonModal';
import './HotelAuditList.css';

// 是否使用 Mock 数据（true = 使用 Mock，false = 使用真实 API）
const USE_MOCK = true;

const { Option } = Select;
const { TextArea } = Input;

const HotelAuditList: React.FC = () => {
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
    handleApprove,
    handleReject,
    handlePublish,
    handleOffline,
    handleRestore,
  } = useAdminHotelList({ useMock: USE_MOCK });

  // UI 相关状态
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [currentRejectReason, setCurrentRejectReason] = useState<string | undefined>();
  
  // 拒绝审核弹窗状态
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectHotelId, setRejectHotelId] = useState<number | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  /** 查看被拒绝的原因 */
  const showRejectReasonModal = (reason?: string) => {
    setCurrentRejectReason(reason);
    setRejectReasonModalOpen(true);
  };

  /** 关闭拒绝原因查看弹窗 */
  const closeRejectReasonModal = () => {
    setRejectReasonModalOpen(false);
    setCurrentRejectReason(undefined);
  };

  /** 打开拒绝审核弹窗 */
  const openRejectModal = (hotelId: number) => {
    setRejectHotelId(hotelId);
    setRejectReasonInput('');
    setRejectModalOpen(true);
  };

  /** 确认拒绝审核 */
  const confirmReject = async () => {
    if (!rejectReasonInput.trim()) {
      message.warning('请输入拒绝原因');
      return;
    }
    
    if (rejectHotelId !== null) {
      await handleReject(rejectHotelId, rejectReasonInput);
      setRejectModalOpen(false);
      setRejectHotelId(null);
      setRejectReasonInput('');
    }
  };

  /** 定义操作回调函数 */
  const callbacks: ColumnCallbacks = {
    onView: (hotel: Hotel) => {
      navigate(ROUTES.ADMIN.HOTEL_DETAIL(hotel.id));
    },
    onApprove: handleApprove,
    onReject: openRejectModal,
    onPublish: handlePublish,
    onOffline: handleOffline,
    onRestore: handleRestore,
    onViewRejectReason: showRejectReasonModal,
  };

  /** 使用工厂函数创建表格列配置 */
  const columns = createHotelColumns('admin', callbacks);

  return (
    <div className="hotel-audit-list-container">
      <Card>
        {/* 页面标题 */}
        <div className="hotel-audit-list-header">
          <h2 className="page-title">酒店审核管理</h2>
        </div>

        {/* 筛选栏 */}
        <div className="hotel-audit-list-filters">
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
          scroll={{ x: 1600 }}
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

      {/* 查看拒绝原因弹窗 */}
      <RejectReasonModal
        open={rejectReasonModalOpen}
        reason={currentRejectReason}
        onClose={closeRejectReasonModal}
      />

      {/* 输入拒绝原因弹窗 */}
      <Modal
        title="拒绝审核"
        open={rejectModalOpen}
        onOk={confirmReject}
        onCancel={() => setRejectModalOpen(false)}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 8 }}>请输入拒绝原因：</div>
        <TextArea
          rows={4}
          placeholder="请输入拒绝原因，将会通知给商户"
          value={rejectReasonInput}
          onChange={(e) => setRejectReasonInput(e.target.value)}
          maxLength={200}
          showCount
        />
      </Modal>
    </div>
  );
};

export default HotelAuditList;
